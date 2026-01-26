const ROUTES = {
  USERS: {
    PARTICIPANTS: {
      MAIN: "/users/participants",
      DETAIL: (id: string) => `/users/participants/${id}`,
      QUESTIONNAIRES: (id: string) =>
        `/users/participants/${id}/questionnaires`,
      EVALUATIONS: (id: string) => `/users/participants/${id}/evaluations`,
    },
  },
};

export default ROUTES;
