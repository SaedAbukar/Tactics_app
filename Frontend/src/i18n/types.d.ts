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
      };
      footer: { copyright: string };
      home: {
        title: string;
        description: string;
        greeting: string;
        items: string;
        items_plural: string;
        welcome: string;
        tactics_app: string;
        explore: string;
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
      };
    };
  }
}
