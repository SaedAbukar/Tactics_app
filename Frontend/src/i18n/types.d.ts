import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: {
        save: string;
        add: string;
        delete: string;
        cancel: string;
      };
      header: {
        appName: string;
        homeLink: string;
        tacticalBoardLink: string;
        language: string;
        english: string;
        finnish: string;
        spanish: string;
        login: string;
        logout: string;
        profile: string;
      };
      footer: { copyright: string };
      home: {
        hero: {
          welcome_back: string;
          elevate_title: string;
          ready_desc: string;
          logged_out_desc: string;
          cta_dashboard: string;
          cta_start: string;
          cta_login: string;
        };
        cards: {
          tactical_title: string;
          tactical_desc: string;
          session_title: string;
          session_desc: string;
          session_sub: string;
          profile_title: string;
          profile_desc_user: string;
          profile_desc_guest: string;
        };
        items_one: string;
        items_other: string;
        greeting: string;
      };
      tacticalEditor: {
        step: string;
        sessionAlreadyAdded: string;
        stepAdded: string;
        stepUpdated: string;
        saveStep: string;
        play: string;
        pause: string;
        continue: string;
        stop: string;
        clearPitch: string;
        useUserData: string;
        useMockData: string;
        colors: {
          white: string;
          black: string;
          blue: string;
          red: string;
          yellow: string;
          purple: string;
          orange: string;
          cyan: string;
          pink: string;
        };
        sessionSelector: {
          manageViewType: string;
          namePlaceholder: string;
          descriptionPlaceholder: string;
          add: string;
          saveUpdate: string;
          select: string;
          addSessionPlaceholder: string;
          update: string;
          delete: string;
        };
        controls: {
          createTeam: string;
          teamNamePlaceholder: string;
          addTeam: string;
          players: string;
          addPlayers: string;
          balls: string;
          addBalls: string;
          goals: string;
          addGoals: string;
          cones: string;
          addCones: string;
          animation: string;
          speed: string;
          resetSpeed: string;
          clearPitch: string;
        };
        formationSelector: {
          teamLabel: string;
          formationLabel: string;
          noTeamOption: string;
          selectFormationOption: string;
          addFormation: string;
          selectTeamAlert: string;
          selectFormationAlert: string;
          invalidFormationAlert: string;
          noPositionsAlert: string;
        };
      };
    };
  }
}
