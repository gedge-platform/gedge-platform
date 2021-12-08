// @flow
import {
	CHANGE_LAYOUT,
	CHANGE_LAYOUT_WIDTH,
	CHANGE_SIDEBAR_THEME,
	CHANGE_SIDEBAR_TYPE,
	CHANGE_TOPBAR_THEME,
	TOGGLE_RIGHT_SIDEBAR,
	SHOW_RIGHT_SIDEBAR,
	CHANGE_PRELOADER,
	HIDE_RIGHT_SIDEBAR
} from "./actionTypes";

const INIT_STATE = {
	layoutType: "vertical",
	layoutWidth: "fluid",
	leftSideBarTheme: "light",
	leftSideBarType: "default",
	topbarTheme: "light",
	isPreloader: false,
	showRightSidebar: false,
	isMobile: false
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_LAYOUT:
			return {
				...state,
				layoutType: action.payload
			};
		case CHANGE_PRELOADER:
			return {
				...state,
				isPreloader: action.payload
			};

		case CHANGE_LAYOUT_WIDTH:
			return {
				...state,
				layoutWidth: action.payload.width
			};
		case CHANGE_SIDEBAR_THEME:
			return {
				...state,
				leftSideBarTheme: action.payload.theme
			};
		case CHANGE_SIDEBAR_TYPE:
			return {
				...state,
				leftSideBarType: action.payload.sidebarType
			};
		case CHANGE_TOPBAR_THEME:
			return {
				...state,
				topbarTheme: action.payload
			};
		case TOGGLE_RIGHT_SIDEBAR:
			return {
				...state,
				showRightSidebar: !state.showRightSidebar
			};
		case SHOW_RIGHT_SIDEBAR:
			return {
				...state,
				showRightSidebar: true
			};
		case HIDE_RIGHT_SIDEBAR:
			return {
				...state,
				showRightSidebar: false
			};
		default:
			return state;
	}
};

export default Layout;
