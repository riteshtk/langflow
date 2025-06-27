# Custom Sidebar Folder Component

## Overview

This document explains how to safely customize the sidebar folder component without conflicts when pulling from the main repository.

## What Was Done

1. **Created Custom Component**: A custom version of the sidebar folder component was created at:
   ```
   src/customization/components/custom-sidebar-folder.tsx
   ```

2. **Added Feature Flag**: A new feature flag was added to control which component to use:
   ```typescript
   export const ENABLE_CUSTOM_SIDEBAR_FOLDER = false;
   ```

3. **Updated Main Component**: The main sidebar component was updated to conditionally render either the original or custom component based on the feature flag.

## How It Works

The main component (`src/components/core/folderSidebarComponent/components/sideBarFolderButtons/index.tsx`) now:

1. **Imports both components**: The original logic and the custom component
2. **Uses conditional rendering**: Based on `ENABLE_CUSTOM_SIDEBAR_FOLDER` flag
3. **Maintains compatibility**: The original component remains untouched

```typescript
// Main component that conditionally renders either original or custom
const SideBarFoldersButtonsComponent = (props: SideBarFoldersButtonsComponentProps) => {
  // If custom sidebar is enabled, use the custom component
  if (ENABLE_CUSTOM_SIDEBAR_FOLDER) {
    return <CustomSideBarFoldersButtonsComponent {...props} />;
  }

  // Otherwise, use the original component
  return <OriginalSideBarFoldersButtonsComponent {...props} />;
};
```

## How to Enable Custom Sidebar

To use your custom sidebar folder component:

1. **Enable the feature flag** in `src/customization/feature-flags.ts`:
   ```typescript
   export const ENABLE_CUSTOM_SIDEBAR_FOLDER = true;
   ```

2. **Customize the component** in `src/customization/components/custom-sidebar-folder.tsx`

3. **Test your changes** to ensure everything works correctly

## How to Customize

You can modify the custom sidebar component (`src/customization/components/custom-sidebar-folder.tsx`) to:

- **Change styling and layout**
- **Add new functionality**
- **Modify folder behavior**
- **Add custom animations**
- **Change the UI structure**
- **Add new features**

## Benefits

- **No Conflicts**: The original component logic remains untouched
- **Safe Customization**: You can modify the custom component without merge conflicts
- **Easy Toggle**: Simply change the feature flag to switch between versions
- **Maintainable**: When upstream changes occur, you can easily compare and merge
- **Follows Pattern**: Uses the same customization pattern as other components

## File Structure

```
src/
├── components/core/folderSidebarComponent/components/sideBarFolderButtons/
│   └── index.tsx                                    # Main component with conditional logic
├── customization/
│   ├── components/
│   │   └── custom-sidebar-folder.tsx               # Your custom version
│   └── feature-flags.ts                            # Feature flag control
```

## Example Customizations

### Change the Title
```typescript
// In custom-sidebar-folder.tsx
<h2 className="text-sm font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:from-primary/80 dark:to-primary">
  My Custom Projects
</h2>
```

### Add Custom Styling
```typescript
// Add custom classes to the sidebar
<Sidebar
  collapsible={isMobile ? "offcanvas" : "none"}
  data-testid="project-sidebar"
  className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 backdrop-blur-xl border-r border-border/50 shadow-xl shadow-background/10 rounded-xl m-2 transition-all duration-300"
>
```

### Add Custom Functionality
```typescript
// Add custom click handlers or modify existing ones
const handleCustomFolderClick = (folderId: string) => {
  console.log('Custom folder click:', folderId);
  handleChangeFolder!(folderId);
};
```

## Best Practices

1. **Keep Original Intact**: Never modify the original component logic
2. **Test Both Versions**: Always test with both feature flag values
3. **Document Changes**: Add comments explaining your customizations
4. **Follow Patterns**: Use the same patterns and conventions as the original
5. **Version Control**: Commit your custom component separately

## Troubleshooting

### Component Not Loading
- Check that `ENABLE_CUSTOM_SIDEBAR_FOLDER = true` in feature flags
- Verify the import path is correct
- Check for any syntax errors in your custom component

### Styling Issues
- Ensure all required CSS classes are available
- Check that Tailwind classes are properly configured
- Verify dark mode classes if using them

### Functionality Problems
- Compare your custom component with the original
- Check that all required props are being passed correctly
- Verify that all dependencies are imported

## Future Updates

When the original sidebar component is updated:

1. **Compare Changes**: Compare the original component with your custom version
2. **Merge Carefully**: Manually merge any new features or bug fixes you want
3. **Test Both Versions**: Test with both feature flag values
4. **Update Documentation**: Update this README if needed

## Feature Flag Control

The `ENABLE_CUSTOM_SIDEBAR_FOLDER` flag controls which component is used:

- `false` (default): Uses the original sidebar component
- `true`: Uses your custom sidebar component

You can also make this configurable through environment variables or user settings if needed.

This approach ensures you can safely customize the sidebar folder component while maintaining the ability to receive updates from the main repository without conflicts. 