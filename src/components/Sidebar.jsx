import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { navbarLinks } from "@/constants";

import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
import logoSgu from "@/assets/logoSgu.png";
import { useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

import PropTypes from "prop-types";
import { useAuth } from "@/hooks/use-auth";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { features } = useAuth();
    const [filteredSidebarLinks, setFilteredSidebarLinks] = useState([]);

    useEffect(() => {
        // console.log("features", features);
        const featuresWithIsShow = features
            .filter(item => item.can_view) // Chỉ lấy các item có can_view = true
            .map(item => ({
                name: item.feature.name,
                isShow: true
            }));

        const featureNameMap = {
            "Quản lý dự án": "Dự Án",
            "Quản lý nhân viên": "Nhân Viên",
            "Quản lý phòng ban": "Phòng Ban",
            "Quản lý tài khoản": "Tài Khoản",
            "Quản lý nhóm quyền": "Nhóm Quyền",
            "Quản lý công việc phòng ban": "Công Việc Phòng Ban",
            "Quản lý công việc": "Công Việc",
            "Công việc lưu trữ": "Công Việc Lưu Trữ",
            "Thống kê" : "Thống kê"
        };

        // Lọc navbarLinks theo featuresWithIsShow
        const filteredSidebarLinks = navbarLinks.filter(link =>
            featuresWithIsShow.some(feature =>
                feature.isShow && featureNameMap[feature.name] === link.label
            )
        );

        // console.log("filteredSidebarLinks", filteredSidebarLinks);
        setFilteredSidebarLinks(filteredSidebarLinks)
    }, [features])





    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3 flex-col items-center">
                <img
              
                    src={logoSgu}
                    alt="SGU"
                    className="dark:hidden w-24 object-cover"
                />
                <img
                    src={logoSgu}
                    alt="SGU"
                    className="hidden dark:block  w-24 object-cover"
                />
                {!collapsed && 
                <p className="mt-2 text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">
                    <span className="text-blue-500 font-extrabold">SGU</span> <span className="font-normal ">Task Manager</span>
                </p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">

                {filteredSidebarLinks && filteredSidebarLinks.map((link) => (
                    <NavLink
                        key={link.label}
                        to={link.path}
                        className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                    >
                        <link.icon
                            size={22}
                            className="flex-shrink-0"
                        />
                        {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                    </NavLink>

                ))}

                {/* {features && features.map((link) => (
                    <NavLink
                        key={link.feature.id}
                        // to={link.feature}
                        className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                    >
                      
                        {!collapsed && <p className="whitespace-nowrap">{link.feature.name}</p>}
                    </NavLink>
                )) 

                }*/}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
