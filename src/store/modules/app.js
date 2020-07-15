const state = {
	sidebar: {
		opened: true,
		mobileOpened: false,
		desktopOpened: true,
		withoutAnimation: false
	},
	device: 'desktop'
}

const mutations = {
	TOGGLE_SIDEBAR: state => {
		state.sidebar.withoutAnimation = false
		state.sidebar.opened = !state.sidebar.opened;
		if (state.device === 'mobile' && state.sidebar.opened) {
			state.sidebar.mobileOpened = true;
		} else {
			state.sidebar.desktopOpened = state.sidebar.opened;
		}

	},
	CLOSE_SIDEBAR: (state, withoutAnimation) => {
		state.sidebar.opened = false;
		state.sidebar.withoutAnimation = withoutAnimation
		if (state.device === 'mobile') {
			state.sidebar.mobileOpened = false;
		} else {
			state.sidebar.opened = state.sidebar.desktopOpened;
		}

	},
	TOGGLE_DEVICE: (state, device) => {
		state.device = device
		state.sidebar.opened = state.sidebar.desktopOpened;
	}
}

const actions = {
	toggleSideBar({
		commit
	}) {
		commit('TOGGLE_SIDEBAR')
	},
	closeSideBar({
		commit
	}, {
		withoutAnimation
	}) {
		commit('CLOSE_SIDEBAR', withoutAnimation)
	},
	toggleDevice({
		commit
	}, device) {
		commit('TOGGLE_DEVICE', device)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
