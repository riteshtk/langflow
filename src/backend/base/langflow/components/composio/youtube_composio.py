from typing import Any

from composio import Action

from langflow.base.composio.composio_base import ComposioBaseComponent
from langflow.inputs import (
    BoolInput,
    IntInput,
    MessageTextInput,
)
from langflow.logging import logger


class ComposioYouTubeAPIComponent(ComposioBaseComponent):
    display_name: str = "YouTube"
    description: str = "YouTube API"
    icon = "YouTube"
    documentation: str = "https://docs.composio.dev"
    app_name = "youtube"

    _actions_data: dict = {
        "YOUTUBE_GET_CHANNEL_ID_BY_HANDLE": {
            "display_name": "Get Channel ID by Handle",
            "action_fields": ["channel_handle"],
        },
        "YOUTUBE_LIST_CAPTION_TRACK": {
            "display_name": "List Caption Track",
            "action_fields": ["part", "videoId"],
        },
        "YOUTUBE_LIST_CHANNEL_VIDEOS": {
            "display_name": "List Channel Videos",
            "action_fields": ["channelId", "maxResults", "pageToken", "part"],
        },
        "YOUTUBE_LIST_USER_PLAYLISTS": {
            "display_name": "List User Playlists",
            "action_fields": ["maxResults", "pageToken", "part"],
        },
        "YOUTUBE_LIST_USER_SUBSCRIPTIONS": {
            "display_name": "List User Subscriptions",
            "action_fields": ["maxResults", "pageToken", "part"],
        },
        "YOUTUBE_LOAD_CAPTIONS": {
            "display_name": "Load Captions",
            "action_fields": ["id", "tfmt"],
        },
        "YOUTUBE_SEARCH_YOU_TUBE": {
            "display_name": "Search YouTube",
            "action_fields": ["maxResults", "pageToken", "part", "q", "type"],
        },
        "YOUTUBE_SUBSCRIBE_CHANNEL": {
            "display_name": "Subscribe Channel",
            "action_fields": ["channelId"],
        },
        "YOUTUBE_UPDATE_THUMBNAIL": {
            "display_name": "Update Thumbnail",
            "action_fields": ["thumbnailUrl", "videoId"],
        },
        "YOUTUBE_UPDATE_VIDEO": {
            "display_name": "Update Video",
            "action_fields": ["categoryId", "description", "privacyStatus", "tags", "title", "videoId"],
        },
        "YOUTUBE_VIDEO_DETAILS": {
            "display_name": "Video Details",
            "action_fields": ["id", "part"],
        },
    }

    _all_fields = {field for action_data in _actions_data.values() for field in action_data["action_fields"]}
    _bool_variables = {
        "YOUTUBE_SEARCH_VIDEOS_video_embeddable",
        "YOUTUBE_SEARCH_VIDEOS_video_syndicated",
    }

    inputs = [
        *ComposioBaseComponent._base_inputs,
        # YOUTUBE_GET_CHANNEL_ID_BY_HANDLE
        MessageTextInput(
            name="channel_handle",
            display_name="Channel Handle",
            info="The handle of the channel (e.g. @composio)",
            show=False,
            required=True,
        ),
        # YOUTUBE_LIST_CAPTION_TRACK
        MessageTextInput(
            name="part",
            display_name="Part",
            info="The part parameter (default: snippet)",
            show=False,
            advanced=True,
            value="snippet",
        ),
        MessageTextInput(
            name="videoId",
            display_name="Video ID",
            info="The ID of the video",
            show=False,
            required=True,
        ),
        # YOUTUBE_LIST_CHANNEL_VIDEOS
        MessageTextInput(
            name="channelId",
            display_name="Channel ID",
            info="The ID of the channel",
            show=False,
            required=True,
        ),
        IntInput(
            name="maxResults",
            display_name="Max Results",
            info="Maximum number of results to return (default: 5)",
            show=False,
            value=5,
        ),
        MessageTextInput(
            name="pageToken",
            display_name="Page Token",
            info="Token for pagination",
            show=False,
            advanced=True,
        ),
        # YOUTUBE_LIST_USER_PLAYLISTS, YOUTUBE_LIST_USER_SUBSCRIPTIONS
        # (reuse maxResults, pageToken, part)
        # YOUTUBE_LOAD_CAPTIONS
        MessageTextInput(
            name="id",
            display_name="Caption ID",
            info="The ID of the caption track",
            show=False,
            required=True,
        ),
        MessageTextInput(
            name="tfmt",
            display_name="Caption Format",
            info="The format of the caption (default: srt)",
            show=False,
            advanced=True,
            value="srt",
        ),
        # YOUTUBE_SEARCH_YOU_TUBE
        MessageTextInput(
            name="q",
            display_name="Query",
            info="Search query string",
            show=False,
            required=True,
        ),
        MessageTextInput(
            name="type",
            display_name="Type",
            info="Type of resource to search for (default: video)",
            show=False,
            advanced=True,
            value="video",
        ),
        # YOUTUBE_SUBSCRIBE_CHANNEL
        # (reuse channelId)
        # YOUTUBE_UPDATE_THUMBNAIL
        MessageTextInput(
            name="thumbnailUrl",
            display_name="Thumbnail URL",
            info="URL of the new thumbnail",
            show=False,
            required=True,
        ),
        # (reuse videoId)
        # YOUTUBE_UPDATE_VIDEO
        MessageTextInput(
            name="categoryId",
            display_name="Category ID",
            info="Category ID for the video",
            show=False,
            advanced=True,
        ),
        MessageTextInput(
            name="description",
            display_name="Description",
            info="Description of the video",
            show=False,
            advanced=True,
        ),
        MessageTextInput(
            name="privacyStatus",
            display_name="Privacy Status",
            info="Privacy status of the video",
            show=False,
            advanced=True,
        ),
        MessageTextInput(
            name="tags",
            display_name="Tags",
            info="Comma-separated tags for the video",
            show=False,
            advanced=True,
        ),
        MessageTextInput(
            name="title",
            display_name="Title",
            info="Title of the video",
            show=False,
            advanced=True,
        ),
        # (reuse videoId)
        # YOUTUBE_VIDEO_DETAILS
        MessageTextInput(
            name="id",
            display_name="Video ID (Details)",
            info="The ID of the video for details",
            show=False,
            required=True,
        ),
        MessageTextInput(
            name="part",
            display_name="Part (Details)",
            info="The part parameter (default: snippet,contentDetails,statistics)",
            show=False,
            advanced=True,
            value="snippet,contentDetails,statistics",
        ),
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

                    param_name = field.replace(action_key + "_", "")
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
            "YOUTUBE_SEARCH_VIDEOS",
            "YOUTUBE_GET_VIDEO_DETAILS",
        } 