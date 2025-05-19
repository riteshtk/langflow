from typing import Any

from composio import Action

from langflow.base.composio.composio_base import ComposioBaseComponent
from langflow.inputs import (
    BoolInput,
    IntInput,
    MessageTextInput,
)
from langflow.logging import logger


class ComposioConfluenceAPIComponent(ComposioBaseComponent):
    display_name: str = "Confluence"
    description: str = "Confluence API"
    icon = "Confluence"
    documentation: str = "https://docs.composio.dev"
    app_name = "confluence"

    _actions_data: dict = {
        "CONFLUENCE_CHECK_SITE_ACCESS_FOR_A_LIST_OF_EMAILS": {
            "display_name": "Check Site Access For Emails",
            "action_fields": ["emails"],
        },
        "CONFLUENCE_CONVERT_CONTENT_IDS_TO_CONTENT_TYPES": {
            "display_name": "Convert Content IDs To Types",
            "action_fields": ["contentIds"],
        },
        "CONFLUENCE_CREATE_BLOG_POST": {
            "display_name": "Create Blog Post",
            "action_fields": ["body", "createdAt", "private", "spaceId", "confluence_status", "title"],
        },
        "CONFLUENCE_CREATE_BULK_USER_LOOKUP_USING_IDS": {
            "display_name": "Bulk User Lookup By IDs",
            "action_fields": ["accountIds"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_ATTACHMENT": {
            "display_name": "Create Content Property For Attachment",
            "action_fields": ["attachment__id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_BLOG_POST": {
            "display_name": "Create Content Property For Blog Post",
            "action_fields": ["blogpost__id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_COMMENT": {
            "display_name": "Create Content Property For Comment",
            "action_fields": ["comment__id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_CUSTOM_CONTENT": {
            "display_name": "Create Content Property For Custom Content",
            "action_fields": ["custom__content__id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_DATABASE": {
            "display_name": "Create Content Property For Database",
            "action_fields": ["id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_FOLDER": {
            "display_name": "Create Content Property For Folder",
            "action_fields": ["id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_PAGE": {
            "display_name": "Create Content Property For Page",
            "action_fields": ["key", "page__id", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_SMART_LINK_IN_THE_CONTENT_TREE": {
            "display_name": "Create Content Property For Smart Link",
            "action_fields": ["id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CONTENT_PROPERTY_FOR_WHITEBOARD": {
            "display_name": "Create Content Property For Whiteboard",
            "action_fields": ["id", "key", "value"],
        },
        "CONFLUENCE_CREATE_CUSTOM_CONTENT": {
            "display_name": "Create Custom Content",
            "action_fields": ["blogPostId", "body", "customContentId", "pageId", "spaceId", "confluence_status", "title", "type"],
        },
        "CONFLUENCE_CREATE_DATABASE": {
            "display_name": "Create Database",
            "action_fields": ["parentId", "private", "spaceId", "title"],
        },
        "CONFLUENCE_CREATE_FOLDER": {
            "display_name": "Create Folder",
            "action_fields": ["parentId", "spaceId", "title"],
        },
        "CONFLUENCE_CREATE_FOOTER_COMMENT": {
            "display_name": "Create Footer Comment",
            "action_fields": ["attachmentId", "blogPostId", "body", "customContentId", "pageId", "parentCommentId"],
        },
        "CONFLUENCE_CREATE_INLINE_COMMENT": {
            "display_name": "Create Inline Comment",
            "action_fields": ["blogPostId", "body", "inlineCommentProperties__textSelection", "inlineCommentProperties__textSelectionMatchCount", "inlineCommentProperties__textSelectionMatchIndex", "pageId", "parentCommentId"],
        },
        "CONFLUENCE_CREATE_PAGE": {
            "display_name": "Create Page",
            "action_fields": ["body", "embedded", "parentId", "private", "root__level", "spaceId", "confluence_status", "title"],
        },
        "CONFLUENCE_CREATE_SMART_LINK_IN_THE_CONTENT_TREE": {
            "display_name": "Create Smart Link In Content Tree",
            "action_fields": ["embedUrl", "parentId", "spaceId", "title"],
        },
        "CONFLUENCE_CREATE_SPACE": {
            "display_name": "Create Space",
            "action_fields": ["alias", "description__representation", "description__value", "key", "name", "roleAssignments__principal__principalId", "roleAssignments__principal__principalType", "roleAssignments__roleId", "roleAssignments__roleId"],
        },
        "CONFLUENCE_CREATE_SPACE_PROPERTY_IN_SPACE": {
            "display_name": "Create Space Property In Space",
            "action_fields": ["key", "space__id", "value"],
        },
        "CONFLUENCE_CREATE_WHITEBOARD": {
            "display_name": "Create Whiteboard",
            "action_fields": ["locale", "parentId", "private", "spaceId", "templateKey", "title"],
        },
        # ... (add more actions as needed from the docs)
    }

    _all_fields = {field for action_data in _actions_data.values() for field in action_data["action_fields"]}
    _bool_variables = {"private", "embedded", "root__level"}

    inputs = [
        *ComposioBaseComponent._base_inputs,
        MessageTextInput(name="emails", display_name="Emails (JSON Array)", info="List of emails (JSON Array)", show=False, required=True),
        MessageTextInput(name="contentIds", display_name="Content IDs (JSON Array)", info="List of content IDs (JSON Array)", show=False, required=True),
        MessageTextInput(name="body", display_name="Body (JSON)", info="Body object (JSON)", show=False, required=True),
        MessageTextInput(name="createdAt", display_name="Created At", info="Creation timestamp", show=False),
        BoolInput(name="private", display_name="Private", info="Set as private", show=False),
        MessageTextInput(name="spaceId", display_name="Space ID", info="ID of the space", show=False, required=True),
        MessageTextInput(name="confluence_status", display_name="Status", info="Status (e.g., draft, published)", show=False),
        MessageTextInput(name="title", display_name="Title", info="Title", show=False),
        MessageTextInput(name="accountIds", display_name="Account IDs (JSON Array)", info="List of account IDs (JSON Array)", show=False, required=True),
        MessageTextInput(name="attachment__id", display_name="Attachment ID", info="Attachment ID", show=False, required=True),
        MessageTextInput(name="key", display_name="Key", info="Key for property", show=False),
        MessageTextInput(name="value", display_name="Value", info="Value for property", show=False),
        MessageTextInput(name="blogpost__id", display_name="Blog Post ID", info="Blog Post ID", show=False, required=True),
        MessageTextInput(name="comment__id", display_name="Comment ID", info="Comment ID", show=False, required=True),
        MessageTextInput(name="custom__content__id", display_name="Custom Content ID", info="Custom Content ID", show=False, required=True),
        MessageTextInput(name="id", display_name="ID", info="Generic ID field", show=False, required=True),
        MessageTextInput(name="page__id", display_name="Page ID", info="Page ID", show=False, required=True),
        MessageTextInput(name="embedUrl", display_name="Embed URL", info="URL for smart link", show=False),
        MessageTextInput(name="parentId", display_name="Parent ID", info="Parent ID", show=False),
        MessageTextInput(name="alias", display_name="Alias", info="Space alias", show=False),
        MessageTextInput(name="description__representation", display_name="Description Representation", info="Description representation", show=False),
        MessageTextInput(name="description__value", display_name="Description Value", info="Description value", show=False),
        MessageTextInput(name="key", display_name="Key", info="Key for property", show=False),
        MessageTextInput(name="name", display_name="Name", info="Name", show=False, required=True),
        MessageTextInput(name="roleAssignments__principal__principalId", display_name="Role Principal ID", info="Role principal ID", show=False),
        MessageTextInput(name="roleAssignments__principal__principalType", display_name="Role Principal Type", info="Role principal type", show=False),
        MessageTextInput(name="roleAssignments__roleId", display_name="Role ID", info="Role ID", show=False),
        MessageTextInput(name="locale", display_name="Locale", info="Locale for whiteboard", show=False),
        MessageTextInput(name="templateKey", display_name="Template Key", info="Template key for whiteboard", show=False),
        BoolInput(name="embedded", display_name="Embedded", info="Set as embedded", show=False),
        BoolInput(name="root__level", display_name="Root Level", info="Set as root level", show=False),
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

                    param_name = field
                    if field == "confluence_status":
                        param_name = "status"
                    params[param_name] = value

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
            "CONFLUENCE_CREATE_PAGE",
            "CONFLUENCE_SEARCH_CONTENT",
        } 