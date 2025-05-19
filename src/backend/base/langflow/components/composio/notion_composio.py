from typing import Any

from composio import Action

from langflow.base.composio.composio_base import ComposioBaseComponent
from langflow.inputs import (
    BoolInput,
    IntInput,
    MessageTextInput,
)
from langflow.logging import logger


class ComposioNotionAPIComponent(ComposioBaseComponent):
    display_name: str = "Notion"
    description: str = "Notion API"
    icon = "Notion"
    documentation: str = "https://docs.composio.dev"
    app_name = "notion"

    _actions_data: dict = {
        "NOTION_ADD_PAGE_CONTENT": {
            "display_name": "Add Page Content",
            "action_fields": ["after", "content_block", "parent_block_id"],
        },
        "NOTION_APPEND_BLOCK_CHILDREN": {
            "display_name": "Append Block Children",
            "action_fields": ["after", "block_id", "children"],
        },
        "NOTION_ARCHIVE_NOTION_PAGE": {
            "display_name": "Archive Notion Page",
            "action_fields": ["archive", "page_id"],
        },
        "NOTION_CREATE_COMMENT": {
            "display_name": "Create Comment",
            "action_fields": ["comment", "discussion_id", "parent_page_id"],
        },
        "NOTION_CREATE_DATABASE": {
            "display_name": "Create Database",
            "action_fields": ["parent_id", "properties", "title"],
        },
        "NOTION_CREATE_NOTION_PAGE": {
            "display_name": "Create Notion Page",
            "action_fields": ["cover", "icon", "parent_id", "title"],
        },
        "NOTION_DELETE_BLOCK": {
            "display_name": "Delete Block",
            "action_fields": ["block_id"],
        },
        "NOTION_DUPLICATE_PAGE": {
            "display_name": "Duplicate Page",
            "action_fields": ["page_id", "parent_id", "title"],
        },
        "NOTION_FETCH_COMMENTS": {
            "display_name": "Fetch Comments",
            "action_fields": ["block_id", "page_size", "start_cursor"],
        },
        "NOTION_FETCH_DATABASE": {
            "display_name": "Fetch Database",
            "action_fields": ["database_id"],
        },
        "NOTION_FETCH_NOTION_BLOCK": {
            "display_name": "Fetch Notion Block",
            "action_fields": ["block_id"],
        },
        "NOTION_FETCH_NOTION_CHILD_BLOCK": {
            "display_name": "Fetch Notion Child Block",
            "action_fields": ["block_id", "page_size", "start_cursor"],
        },
        "NOTION_FETCH_ROW": {
            "display_name": "Fetch Row",
            "action_fields": ["page_id"],
        },
        "NOTION_GET_ABOUT_ME": {
            "display_name": "Get About Me",
            "action_fields": [],
        },
        "NOTION_GET_ABOUT_USER": {
            "display_name": "Get About User",
            "action_fields": ["user_id"],
        },
        "NOTION_GET_PAGE_PROPERTY_ACTION": {
            "display_name": "Get Page Property",
            "action_fields": ["page_id", "page_size", "property_id", "start_cursor"],
        },
        "NOTION_INSERT_ROW_DATABASE": {
            "display_name": "Insert Row Database",
            "action_fields": ["child_blocks", "cover", "database_id", "icon", "properties"],
        },
        "NOTION_LIST_USERS": {
            "display_name": "List Users",
            "action_fields": ["page_size", "start_cursor"],
        },
        "NOTION_NOTION_UPDATE_BLOCK": {
            "display_name": "Update Block",
            "action_fields": ["additional_properties", "block_id", "block_type", "content"],
        },
        "NOTION_QUERY_DATABASE": {
            "display_name": "Query Database",
            "action_fields": ["database_id", "page_size", "sorts", "start_cursor"],
        },
        "NOTION_SEARCH_NOTION_PAGE": {
            "display_name": "Search Notion Page",
            "action_fields": ["direction", "filter_property", "filter_value", "page_size", "query", "start_cursor", "timestamp"],
        },
        "NOTION_UPDATE_ROW_DATABASE": {
            "display_name": "Update Row Database",
            "action_fields": ["cover", "delete_row", "icon", "properties", "row_id"],
        },
        "NOTION_UPDATE_SCHEMA_DATABASE": {
            "display_name": "Update Schema Database",
            "action_fields": ["database_id", "description", "properties", "title"],
        },
    }

    _all_fields = {field for action_data in _actions_data.values() for field in action_data["action_fields"]}
    _bool_variables = {"archive", "delete_row"}

    inputs = [
        *ComposioBaseComponent._base_inputs,
        MessageTextInput(name="after", display_name="After", info="ID of the block after which to add content", show=False, advanced=True),
        MessageTextInput(name="content_block", display_name="Content Block (JSON)", info="Content block object (JSON)", show=False, required=True),
        MessageTextInput(name="parent_block_id", display_name="Parent Block ID", info="ID of the parent block", show=False, required=True),
        MessageTextInput(name="block_id", display_name="Block ID", info="ID of the block", show=False, required=True),
        MessageTextInput(name="children", display_name="Children (JSON Array)", info="Children blocks (JSON Array)", show=False, required=True),
        BoolInput(name="archive", display_name="Archive", info="Archive (True) or Unarchive (False) the page", show=False, value=True),
        MessageTextInput(name="page_id", display_name="Page ID", info="ID of the page", show=False, required=True),
        MessageTextInput(name="comment", display_name="Comment (JSON)", info="Comment object (JSON)", show=False, required=True),
        MessageTextInput(name="discussion_id", display_name="Discussion ID", info="ID of the discussion thread", show=False, advanced=True),
        MessageTextInput(name="parent_page_id", display_name="Parent Page ID", info="ID of the parent page for the comment", show=False, advanced=True),
        MessageTextInput(name="parent_id", display_name="Parent ID", info="ID of the parent page or block", show=False, required=True),
        MessageTextInput(name="properties", display_name="Properties (JSON Array)", info="Properties schema/columns (JSON Array)", show=False, required=True),
        MessageTextInput(name="title", display_name="Title", info="Title for the page or database", show=False, required=True),
        MessageTextInput(name="cover", display_name="Cover", info="Cover image URL", show=False, advanced=True),
        MessageTextInput(name="icon", display_name="Icon", info="Icon (emoji or URL)", show=False, advanced=True),
        MessageTextInput(name="database_id", display_name="Database ID", info="ID of the database", show=False, required=True),
        MessageTextInput(name="child_blocks", display_name="Child Blocks (JSON Array)", info="Child blocks (JSON Array)", show=False, advanced=True),
        IntInput(name="page_size", display_name="Page Size", info="Number of results per page", show=False, value=30),
        MessageTextInput(name="start_cursor", display_name="Start Cursor", info="Cursor for pagination", show=False, advanced=True),
        MessageTextInput(name="user_id", display_name="User ID", info="User ID for user info", show=False, required=True),
        MessageTextInput(name="property_id", display_name="Property ID", info="ID of the property to retrieve", show=False, required=True),
        MessageTextInput(name="sorts", display_name="Sorts (JSON Array)", info="Sorting options (JSON Array)", show=False, advanced=True),
        MessageTextInput(name="direction", display_name="Direction", info="Direction for search", show=False, advanced=True),
        MessageTextInput(name="filter_property", display_name="Filter Property", info="Property to filter on (default: object)", show=False, advanced=True, value="object"),
        MessageTextInput(name="filter_value", display_name="Filter Value", info="Value to filter on (default: page)", show=False, advanced=True, value="page"),
        MessageTextInput(name="query", display_name="Query", info="Search query string", show=False, advanced=True),
        MessageTextInput(name="timestamp", display_name="Timestamp", info="Timestamp for search", show=False, advanced=True),
        BoolInput(name="delete_row", display_name="Delete Row", info="Delete the row (True/False)", show=False, advanced=True),
        MessageTextInput(name="row_id", display_name="Row ID", info="ID of the row to update", show=False, required=True),
        MessageTextInput(name="additional_properties", display_name="Additional Properties (JSON)", info="Additional properties for block update (JSON)", show=False, advanced=True),
        MessageTextInput(name="block_type", display_name="Block Type", info="Type of the block", show=False, required=True),
        MessageTextInput(name="content", display_name="Content", info="Content for the block", show=False, required=True),
        MessageTextInput(name="description", display_name="Description", info="Description for the database", show=False, advanced=True),
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
            "NOTION_CREATE_NOTION_PAGE",
            "NOTION_SEARCH_NOTION_PAGE",
        } 