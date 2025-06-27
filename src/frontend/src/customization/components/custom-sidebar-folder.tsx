import ForwardedIconComponent from "@/components/common/genericIconComponent";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DEFAULT_FOLDER,
  DEFAULT_FOLDER_DEPRECATED,
} from "@/constants/constants";
import { useUpdateUser } from "@/controllers/API/queries/auth";
import {
  usePatchFolders,
  usePostFolders,
  usePostUploadFolders,
} from "@/controllers/API/queries/folders";
import { useGetDownloadFolders } from "@/controllers/API/queries/folders/use-get-download-folders";
import { CustomStoreButton } from "@/customization/components/custom-store-button";
import {
  ENABLE_CUSTOM_PARAM,
  ENABLE_DATASTAX_LANGFLOW,
  ENABLE_FILE_MANAGEMENT,
  ENABLE_MCP_NOTICE,
} from "@/customization/feature-flags";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import { customGetDownloadFolderBlob } from "@/customization/utils/custom-get-download-folders";
import { createFileUpload } from "@/helpers/create-file-upload";
import { getObjectsFromFilelist } from "@/helpers/get-objects-from-filelist";
import useUploadFlow from "@/hooks/flows/use-upload-flow";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuthStore from "@/stores/authStore";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FolderType } from "@/pages/MainPage/entities";
import useAlertStore from "@/stores/alertStore";
import useFlowsManagerStore from "@/stores/flowsManagerStore";
import { useFolderStore } from "@/stores/foldersStore";
import { handleKeyDown } from "@/utils/reactflowUtils";
import { cn } from "@/utils/utils";
import useFileDrop from "@/components/core/folderSidebarComponent/hooks/use-on-file-drop";
import { SidebarFolderSkeleton } from "@/components/core/folderSidebarComponent/components/sidebarFolderSkeleton";
import { HeaderButtons } from "@/components/core/folderSidebarComponent/components/sideBarFolderButtons/components/header-buttons";
import { InputEditFolderName } from "@/components/core/folderSidebarComponent/components/sideBarFolderButtons/components/input-edit-folder-name";
import { MCPServerNotice } from "@/components/core/folderSidebarComponent/components/sideBarFolderButtons/components/mcp-server-notice";
import { SelectOptions } from "@/components/core/folderSidebarComponent/components/sideBarFolderButtons/components/select-options";

type SideBarFoldersButtonsComponentProps = {
    handleChangeFolder?: (id: string) => void;
    handleDeleteFolder?: (item: FolderType) => void;
    handleFilesClick?: () => void;
  };
  const CustomSideBarFoldersButtonsComponent = ({
    handleChangeFolder,
    handleDeleteFolder,
    handleFilesClick,
  }: SideBarFoldersButtonsComponentProps) => {
    const location = useLocation();
    const pathname = location.pathname;
    const folders = useFolderStore((state) => state.folders);
    const loading = !folders;
    const refInput = useRef<HTMLInputElement>(null);
  
    const navigate = useCustomNavigate();
  
    const currentFolder = pathname.split("/");
    const urlWithoutPath =
      pathname.split("/").length < (ENABLE_CUSTOM_PARAM ? 5 : 4);
    const checkPathFiles = pathname.includes("files");
  
    const checkPathName = (itemId: string) => {
      if (urlWithoutPath && itemId === myCollectionId && !checkPathFiles) {
        return true;
      }
      return currentFolder.includes(itemId);
    };
  
    const setErrorData = useAlertStore((state) => state.setErrorData);
    const setSuccessData = useAlertStore((state) => state.setSuccessData);
    const isMobile = useIsMobile({ maxWidth: 1024 });
    const folderIdDragging = useFolderStore((state) => state.folderIdDragging);
    const myCollectionId = useFolderStore((state) => state.myCollectionId);
    const takeSnapshot = useFlowsManagerStore((state) => state.takeSnapshot);
  
    const folderId = useParams().folderId ?? myCollectionId ?? "";
  
    const { dragOver, dragEnter, dragLeave, onDrop } = useFileDrop(folderId);
    const uploadFlow = useUploadFlow();
    const [foldersNames, setFoldersNames] = useState({});
    const [editFolders, setEditFolderName] = useState(
      folders.map((obj) => ({ name: obj.name, edit: false })) ?? [],
    );
  
    const isFetchingFolders = !!useIsFetching({
      queryKey: ["useGetFolders"],
      exact: false,
    });
  
    const { mutate: mutateDownloadFolder } = useGetDownloadFolders({});
    const { mutate: mutateAddFolder, isPending } = usePostFolders();
    const { mutate: mutateUpdateFolder } = usePatchFolders();
    const { mutate } = usePostUploadFolders();
  
    const checkHoveringFolder = (folderId: string) => {
      if (folderId === folderIdDragging) {
        return "bg-drag-gradient border-l-4 border-drag-border shadow-lg shadow-drag-shadow";
      }
    };
  
    const isFetchingFolder = !!useIsFetching({
      queryKey: ["useGetFolder"],
      exact: false,
    });
  
    const isDeletingFolder = !!useIsMutating({
      mutationKey: ["useDeleteFolders"],
    });
  
    const isUpdatingFolder =
      isFetchingFolders ||
      isFetchingFolder ||
      isPending ||
      loading ||
      isDeletingFolder;
  
    const handleUploadFlowsToFolder = () => {
      createFileUpload().then((files: File[]) => {
        if (files?.length === 0) {
          return;
        }
  
        getObjectsFromFilelist<any>(files).then((objects) => {
          if (objects.every((flow) => flow.data?.nodes)) {
            uploadFlow({ files }).then(() => {
              setSuccessData({
                title: "Uploaded successfully",
              });
            });
          } else {
            files.forEach((folder) => {
              const formData = new FormData();
              formData.append("file", folder);
              mutate(
                { formData },
                {
                  onSuccess: () => {
                    setSuccessData({
                      title: "Project uploaded successfully.",
                    });
                  },
                  onError: (err) => {
                    console.log(err);
                    setErrorData({
                      title: `Error on uploading your project, try dragging it into an existing project.`,
                      list: [err["response"]["data"]["message"]],
                    });
                  },
                },
              );
            });
          }
        });
      });
    };
  
    const handleDownloadFolder = (id: string, folderName: string) => {
      mutateDownloadFolder(
        {
          folderId: id,
        },
        {
          onSuccess: (response) => {
            customGetDownloadFolderBlob(response, id, folderName, setSuccessData);
          },
          onError: (e) => {
            setErrorData({
              title: `An error occurred while downloading your project.`,
            });
          },
        },
      );
    };
  
    function addNewFolder() {
      mutateAddFolder(
        {
          data: {
            name: "New Project",
            parent_id: null,
            description: "",
          },
        },
        {
          onSuccess: (folder) => {
            track("Create New Project");
            handleChangeFolder!(folder.id);
          },
        },
      );
    }
  
    function handleEditFolderName(e, name): void {
      const {
        target: { value },
      } = e;
      setFoldersNames((old) => ({
        ...old,
        [name]: value,
      }));
    }
  
    useEffect(() => {
      if (folders && folders.length > 0) {
        setEditFolderName(
          folders.map((obj) => ({ name: obj.name, edit: false })),
        );
      }
    }, [folders]);
  
    const handleEditNameFolder = async (item) => {
      const newEditFolders = editFolders.map((obj) => {
        if (obj.name === item.name) {
          return { name: item.name, edit: false };
        }
        return { name: obj.name, edit: false };
      });
      setEditFolderName(newEditFolders);
      if (foldersNames[item.name].trim() !== "") {
        setFoldersNames((old) => ({
          ...old,
          [item.name]: foldersNames[item.name],
        }));
        const body = {
          ...item,
          name: foldersNames[item.name],
          flows: item.flows?.length > 0 ? item.flows : [],
          components: item.components?.length > 0 ? item.components : [],
        };
  
        mutateUpdateFolder(
          {
            data: body,
            folderId: item.id!,
          },
          {
            onSuccess: (updatedFolder) => {
              const updatedFolderIndex = folders.findIndex(
                (f) => f.id === updatedFolder.id,
              );
  
              const updateFolders = [...folders];
              updateFolders[updatedFolderIndex] = updatedFolder;
  
              setFoldersNames({});
              setEditFolderName(
                folders.map((obj) => ({
                  name: obj.name,
                  edit: false,
                })),
              );
            },
          },
        );
      } else {
        setFoldersNames((old) => ({
          ...old,
          [item.name]: item.name,
        }));
      }
    };
  
    const handleDoubleClick = (event, item) => {
      if (item.name === DEFAULT_FOLDER_DEPRECATED) {
        return;
      }
  
      event.stopPropagation();
      event.preventDefault();
  
      handleSelectFolderToRename(item);
    };
  
    const handleSelectFolderToRename = (item) => {
      if (!foldersNames[item.name]) {
        setFoldersNames({ [item.name]: item.name });
      }
  
      if (editFolders.find((obj) => obj.name === item.name)?.name) {
        const newEditFolders = editFolders.map((obj) => {
          if (obj.name === item.name) {
            return { name: item.name, edit: true };
          }
          return { name: obj.name, edit: false };
        });
        setEditFolderName(newEditFolders);
        takeSnapshot();
        return;
      }
  
      setEditFolderName((old) => [...old, { name: item.name, edit: true }]);
      setFoldersNames((oldFolder) => ({
        ...oldFolder,
        [item.name]: item.name,
      }));
      takeSnapshot();
    };
  
    const handleKeyDownFn = (e, item) => {
      if (e.key === "Escape") {
        const newEditFolders = editFolders.map((obj) => {
          if (obj.name === item.name) {
            return { name: item.name, edit: false };
          }
          return { name: obj.name, edit: false };
        });
        setEditFolderName(newEditFolders);
        setFoldersNames({});
        setEditFolderName(
          folders.map((obj) => ({
            name: obj.name,
            edit: false,
          })),
        );
      }
      if (e.key === "Enter") {
        refInput.current?.blur();
      }
    };
  
    const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);
  
    const userData = useAuthStore((state) => state.userData);
    const { mutate: updateUser } = useUpdateUser();
    const userDismissedMcpDialog = userData?.optins?.mcp_dialog_dismissed;
  
    const [isDismissedMcpDialog, setIsDismissedMcpDialog] = useState(
      userDismissedMcpDialog,
    );
  
    const handleDismissMcpDialog = () => {
      setIsDismissedMcpDialog(true);
      updateUser({
        user_id: userData?.id!,
        user: {
          optins: {
            ...userData?.optins,
            mcp_dialog_dismissed: true,
          },
        },
      });
    };
  
    return (
      <Sidebar
        collapsible={isMobile ? "offcanvas" : "none"}
        data-testid="project-sidebar"
        className="bg-sidebar-container backdrop-blur-xl border-r border-sidebar-border-light dark:border-sidebar-border-dark shadow-xl shadow-sidebar-shadow-light dark:shadow-sidebar-shadow-dark rounded-xl m-2 transition-all duration-300"
      >
        <SidebarHeader className="px-4 py-4 border-b border-header-border-light dark:border-header-border-dark bg-header rounded-t-xl">
          <div className="space-y-3">
            <HeaderButtons
              handleUploadFlowsToFolder={handleUploadFlowsToFolder}
              isUpdatingFolder={isUpdatingFolder}
              isPending={isPending}
              addNewFolder={addNewFolder}
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar-thin scrollbar-thumb-scrollbar-thumb-light dark:scrollbar-thumb-scrollbar-thumb-dark scrollbar-track-scrollbar-track-light dark:scrollbar-track-scrollbar-track-dark scrollbar-thumb-rounded-full">
          <SidebarGroup className="p-4 py-3">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {!loading ? (
                  folders.map((item, index) => {
                    const editFolderName = editFolders?.filter(
                      (folder) => folder.name === item.name,
                    )[0];
                    return (
                      <SidebarMenuItem
                        key={index}
                        className="group/menu-button transition-all duration-200"
                        onMouseEnter={() => setHoveredFolderId(item.id!)}
                        onMouseLeave={() => setHoveredFolderId(null)}
                      >
                        <div className="relative flex w-full rounded-lg overflow-hidden">
                          <SidebarMenuButton
                            size="md"
                            onDragOver={(e) => dragOver(e, item.id!)}
                            onDragEnter={(e) => dragEnter(e, item.id!)}
                            onDragLeave={dragLeave}
                            onDrop={(e) => onDrop(e, item.id!)}
                            key={item.id}
                            data-testid={`sidebar-nav-${item.name}`}
                            id={`sidebar-nav-${item.name}`}
                            isActive={checkPathName(item.id!)}
                            onClick={() => handleChangeFolder!(item.id!)}
                            className={cn(
                              "flex-grow pr-8 transition-all duration-300",
                              "hover:bg-folder-hover hover:shadow-md hover:translate-x-1",
                              hoveredFolderId === item.id && "bg-folder-hover shadow-sm",
                              checkPathName(item.id!) && "bg-folder-active shadow-md translate-x-1 font-medium",
                              checkHoveringFolder(item.id!),
                              "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-folder-icon-light before:to-folder-icon-dark before:opacity-0 before:transition-all",
                              checkPathName(item.id!) && "before:opacity-100"
                            )}
                          >
                            <div
                              onDoubleClick={(event) => {
                                handleDoubleClick(event, item);
                              }}
                              className="flex w-full items-center justify-between gap-2 py-2.5"
                            >
                              <div className="flex flex-1 items-center gap-3">
                                <div className={cn(
                                  "p-1 rounded-md transition-colors duration-300",
                                  checkPathName(item.id!) 
                                    ? "bg-folder-bg-light dark:bg-folder-bg-dark" 
                                    : "bg-folder-default-light dark:bg-folder-default-dark",
                                )}>
                                  <ForwardedIconComponent 
                                    name="Folder" 
                                    className={cn(
                                      "h-4 w-4 transition-colors duration-300",
                                      checkPathName(item.id!) 
                                        ? "text-folder-icon-light dark:text-folder-icon-dark" 
                                        : "text-slate-600 dark:text-slate-400"
                                    )} 
                                  />
                                </div>
                                {editFolderName?.edit && !isUpdatingFolder ? (
                                  <InputEditFolderName
                                    handleEditFolderName={handleEditFolderName}
                                    item={item}
                                    refInput={refInput}
                                    handleKeyDownFn={handleKeyDownFn}
                                    handleEditNameFolder={handleEditNameFolder}
                                    editFolderName={editFolderName}
                                    foldersNames={foldersNames}
                                    handleKeyDown={handleKeyDown}
                                  />
                                ) : (
                                  <span className={cn(
                                    "block w-0 grow truncate text-sm opacity-100 transition-colors duration-300",
                                    checkPathName(item.id!) 
                                      ? "text-folder-text-light dark:text-folder-text-dark font-medium" 
                                      : "text-slate-700 dark:text-slate-300"
                                  )}>
                                    {item.name === DEFAULT_FOLDER_DEPRECATED
                                      ? DEFAULT_FOLDER
                                      : item.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </SidebarMenuButton>
                          <div
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/menu-button:opacity-100 transition-all duration-300 scale-90 group-hover/menu-button:scale-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectOptions
                              item={item}
                              index={index}
                              handleDeleteFolder={handleDeleteFolder}
                              handleDownloadFolder={() =>
                                handleDownloadFolder(item.id!, item.name)
                              }
                              handleSelectFolderToRename={
                                handleSelectFolderToRename
                              }
                              checkPathName={checkPathName}
                            />
                          </div>
                        </div>
                      </SidebarMenuItem>
                    );
                  })
                ) : (
                  <div className="space-y-2 animate-pulse">
                    <SidebarFolderSkeleton />
                    <SidebarFolderSkeleton />
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="flex-1" />
  
          {ENABLE_MCP_NOTICE && !isDismissedMcpDialog && (
            <div className="p-3">
              <MCPServerNotice handleDismissDialog={handleDismissMcpDialog} />
            </div>
          )}
        </SidebarContent>
        {ENABLE_FILE_MANAGEMENT && (
          <SidebarFooter className="border-t border-header-border-light dark:border-header-border-dark bg-footer">
            <div className="grid w-full items-center gap-2 p-2">
              {/* TODO: Remove this on cleanup */}
              {ENABLE_DATASTAX_LANGFLOW && <CustomStoreButton />}
              <SidebarMenuButton
                isActive={checkPathFiles}
                onClick={() => handleFilesClick?.()}
                size="md"
                className={cn(
                  "text-sm font-medium transition-all duration-300 rounded-lg w-full justify-start gap-3",
                  "hover:bg-file-hover hover:shadow-md hover:translate-x-1",
                  checkPathFiles && "bg-file-active shadow-md translate-x-1"
                )}
              >
                <div className={cn(
                  "p-1 rounded-md transition-colors duration-300",
                  checkPathFiles 
                    ? "bg-file-bg-light dark:bg-file-bg-dark" 
                    : "bg-folder-default-light dark:bg-folder-default-dark"
                )}>
                  <ForwardedIconComponent 
                    name="File" 
                    className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      checkPathFiles 
                        ? "text-file-icon-light dark:text-file-icon-dark" 
                        : "text-slate-600 dark:text-slate-400"
                    )} 
                  />
                </div>
                <span className={cn(
                  "transition-colors duration-300",
                  checkPathFiles 
                    ? "text-file-text-light dark:text-file-text-dark font-medium" 
                    : "text-slate-700 dark:text-slate-300"
                )}>
                  My Files
                </span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        )}
      </Sidebar>
    );
  };
  export default CustomSideBarFoldersButtonsComponent;