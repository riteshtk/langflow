from typing import Any

from composio import Action

from langflow.base.composio.composio_base import ComposioBaseComponent
from langflow.inputs import (
    BoolInput,
    MessageTextInput,
)
from langflow.logging import logger


class ComposioWhatsAppAPIComponent(ComposioBaseComponent):
    display_name: str = "WhatsApp"
    description: str = "WhatsApp Business API"
    icon = "Whatsapp"
    documentation: str = "https://docs.composio.dev"
    app_name = "whatsapp"

    _actions_data: dict = {
        "WHATSAPP_SEND_CONTACTS": {
            "display_name": "Send Contacts",
            "action_fields": ["contacts", "to_number"],
        },
        "WHATSAPP_SEND_LOCATION": {
            "display_name": "Send Location",
            "action_fields": ["address", "latitude", "longitude", "name", "to_number"],
        },
        "WHATSAPP_SEND_MEDIA": {
            "display_name": "Send Media",
            "action_fields": ["caption", "link", "media_type", "to_number"],
        },
        "WHATSAPP_SEND_MESSAGE": {
            "display_name": "Send Message",
            "action_fields": ["message_id", "preview_url", "text", "to_number"],
        },
        "WHATSAPP_SEND_TEMPLATE_MESSAGE": {
            "display_name": "Send Template Message",
            "action_fields": ["language_code", "template_name", "to_number"],
        },
    }

    _all_fields = {field for action_data in _actions_data.values() for field in action_data["action_fields"]}
    _bool_variables = {"preview_url"}

    inputs = [
        *ComposioBaseComponent._base_inputs,
        # WHATSAPP_SEND_CONTACTS
        MessageTextInput(name="contacts", display_name="Contacts (JSON Array)", info="Array of WhatsApp contact numbers (JSON Array)", show=False, required=True),
        MessageTextInput(name="to_number", display_name="To Number", info="Recipient WhatsApp number", show=False, required=True),
        # WHATSAPP_SEND_LOCATION
        MessageTextInput(name="address", display_name="Address", info="Location address", show=False, required=True),
        MessageTextInput(name="latitude", display_name="Latitude", info="Latitude of the location", show=False, required=True),
        MessageTextInput(name="longitude", display_name="Longitude", info="Longitude of the location", show=False, required=True),
        MessageTextInput(name="name", display_name="Name", info="Name of the location", show=False, required=True),
        # WHATSAPP_SEND_MEDIA
        MessageTextInput(name="caption", display_name="Caption", info="Caption for the media", show=False),
        MessageTextInput(name="link", display_name="Media Link", info="Link to the media file", show=False, required=True),
        MessageTextInput(name="media_type", display_name="Media Type", info="Type of the media (e.g., image, video, document)", show=False, required=True),
        # WHATSAPP_SEND_MESSAGE
        MessageTextInput(name="message_id", display_name="Message ID", info="ID of the message (optional)", show=False),
        BoolInput(name="preview_url", display_name="Preview URL", info="Show preview for URLs in the message", show=False),
        MessageTextInput(name="text", display_name="Text", info="Text message to send", show=False, required=True),
        # WHATSAPP_SEND_TEMPLATE_MESSAGE
        MessageTextInput(name="language_code", display_name="Language Code", info="Language code for the template (default: en_US)", show=False, value="en_US"),
        MessageTextInput(name="template_name", display_name="Template Name", info="Name of the template to use", show=False, required=True),
    ]

    def execute_action(self):
        """Execute action and return response as Message."""
        toolset = self._build_wrapper()

        try:
            self._build_action_maps()
            display_name = self.action[0]["name"] if isinstance(self.action, list) and self.action else self.action
            action_key = self._display_to_key_map.get(display_name)
            if not action_key:
                msg = f"Invalid action: {display_name}"
                raise ValueError(msg)

            enum_name = getattr(Action, action_key)
            params = {}
            if action_key in self._actions_data:
                for field in self._actions_data[action_key]["action_fields"]:
                    value = getattr(self, field)

                    if value is None or value == "":
                        continue

                    if field in self._bool_variables:
                        value = bool(value)

                    params[field] = value

            result = toolset.execute_action(
                action=enum_name,
                params=params,
            )
            if not result.get("successful"):
                return {"error": result.get("error", "No response")}

            return result.get("data", [])
        except Exception as e:
            logger.error(f"Error executing action: {e}")
            display_name = self.action[0]["name"] if isinstance(self.action, list) and self.action else str(self.action)
            msg = f"Failed to execute {display_name}: {e!s}"
            raise ValueError(msg) from e

    def update_build_config(self, build_config: dict, field_value: Any, field_name: str | None = None) -> dict:
        return super().update_build_config(build_config, field_value, field_name)

    def set_default_tools(self):
        self._default_tools = {
            "WHATSAPP_SEND_MESSAGE",
            "WHATSAPP_SEND_MEDIA",
        } 