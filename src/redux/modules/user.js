import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { getCookie, setCookie, deleteCookie } from "../../shared/Cookie";
import { api } from "../../shared/api";

// action type
const SET_USER = "SET_USER";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const EDIT_MENU = "EDIT_MENU";
const DELETE_MENU = "DELETE_MENU";

// action creat function
const setUser = createAction(SET_USER, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
// 내 게시글 page
const editMenu = createAction(EDIT_MENU, (menuId) => ({ menuId }));
const deleteMenu = createAction(DELETE_MENU, (menuId) => ({ menuId }));

// initialState
const initialState = {
  user: {
    userId: 3, // 서버에서 받아온 ID(DB에서 사용)
    loginId: "hwiyu25", // 유저가 가입할 때 사용한 아이디
    nickname: "jihyun",
    postList: [
      {
        menuId: 1,
        imgUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        description: "맛있어요!",
        name: "",
        like: "3",
      },
      {
        menuId: 2,
        imgUrl:
          "https://images.unsplash.com/photo-1432139509613-5c4255815697?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1232&q=80",
        description: "오늘 또 먹으러 갑니다:)",
        name: "",
        like: "2",
      },
      {
        menuId: 3,
        imgUrl:
          "https://images.unsplash.com/photo-1625860633266-8707a63d6671?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "오늘 또 먹으러 갑니다:)",
        name: "",
        like: "4",
      },
      {
        menuId: 4,
        imgUrl:
          "https://images.unsplash.com/photo-1625860633266-8707a63d6671?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "오늘 또 먹으러 갑니다:)",
        name: "",
        like: "1",
      },
    ], // 내 게시물에 보여질 포스트
  },
  is_login: false,
};

// middleware actions
const loginDB =
  (id, pwd) =>
  async (dispatch, getState, { history }) => {
    await api
      .post(`/login`, {
        id: id,
        pwd: pwd,
      })
      .then((res) => {
        console.log(res);
        dispatch(
          setUser({
            token: "",
            id: res.data.id,
            userId: res.data.userId,
            nickname: res.data.nickname,
            postList: [
              {
                menuId: "",
                name: "",
                description: "",
                imgUrl: "",
                like: "",
              },
            ],
          })
        );
        const accessToken = res.data.token;

        setCookie("is_login", `${accessToken}`);
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

// const getUserDB =

const registerDB =
  (id, pwd, nickname) =>
  async (dispatch, getState, { history }) => {
    const regist_user = await api
      .post(`/register`, {
        userId: id,
        pwd: pwd,
        pwdConfirm: pwd,
        nickname: nickname,
      })
      .then((res) => {
        dispatch(
          setUser({
            token: "",
            id: res.data.id,
            userId: res.data.userId,
            nickname: res.data.nickname,
            postList: [
              {
                menuId: "",
                name: "",
                description: "",
                imgUrl: "",
                like: "",
              },
            ],
          })
        );
        window.alert(`${res.data.userId}님 환영합니다`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

// loginCheck api 필요함
// 어떤걸 받아와야하는지 알아야함

const loginCheckDB =
  () =>
  async (dispatch, getState, { history }) => {
    const token = getCookie("is_login");
    console.log(token);
    const check_user = await api
      .post(`/token`, {
        headers: {
          authorization: "Bearer ${token}",
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(
          setUser({
            token: "",
            id: res.data.id,
            userId: res.data.userId,
            nickname: res.data.nickname,
            postList: [
              {
                menuId: "",
                name: "",
                description: "",
                imgUrl: "",
                like: "",
              },
            ],
          })
        );
      })
      .catch((err) => {
        console.log(err.code, err.message);
      });
  };

const logOutDB = () => {
  return function (dispatch, getState, { history }) {
    dispatch(logOut());
    history.replace("/");
  };
};

// api를 어디로 잡아야할지?
const deleteMenuDB =
  (menuId) =>
  (dispatch, getState, { history }) => {
    api
      .delete(`/`)
      .then((res) => dispatch(deleteMenu(menuId)))
      .cathch((err) => console.log("게시글 삭제 실패!", err));
  };

const editMenuDB =
  (menuId) =>
  (dispatch, getState, { history }) => {
    if (!menuId) {
      console.log("게시글 정보가 없습니다!");
      return;
    }
    const menuId = getState().user.postList;
    console.log(menuId);
  };

// reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [EDIT_MENU]: (state, action) => produce(state, (draft) => {}),
    [DELETE_MENU]: (state, action) =>
      produce(state, (draft) => {
        // const deleteList = state.list.filter(())
      }),
  },
  initialState
);

// actionCreators

const actionCreators = {
  loginDB,
  registerDB,
  logOutDB,
  loginCheckDB,
  editMenu,
  editMenuDB,
  deleteMenu,
  deleteMenuDB,
};

export { actionCreators };
