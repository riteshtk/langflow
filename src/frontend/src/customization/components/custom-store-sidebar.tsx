import { ForwardedIconComponent } from "@/components/common/genericIconComponent";

export const CustomStoreSidebar = (
  hasApiKey: boolean = false,
  hasStore: boolean = false,
) => {
  const items: Array<{ title: string; href: string; icon: JSX.Element }> = [];
// const langflowItems = [
//       {
//         title: "Sochflow API Keys",
//         href: "/settings/api-keys",
//         icon: (
//           <ForwardedIconComponent
//             name="Key"
//             className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
//           />
//         ),
//       },
//       {
//         title: "Sochflow Store",
//         href: "/settings/store",
//         icon: (
//           <ForwardedIconComponent
//             name="Store"
//             className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
//           />
//         ),
//       },
//     ];
  if (hasApiKey) {
    items.push({
      title: "Sochflow API Keys",
      href: "/settings/api-keys",
      icon: (
        <ForwardedIconComponent
          name="Key"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    });
  }

  // if (hasStore) {
  //   items.push({
  //     title: "Sochflow Store",
  //     href: "/settings/store",
  //     icon: (
  //       <ForwardedIconComponent
  //         name="Store"
  //         className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
  //       />
  //     ),
  //   });
  // }

  return items;
};
