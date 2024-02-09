sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, JSONModel) {

  "use strict";
  return Controller.extend("projectdes.controller.BaseController", {

    getRouter: function () {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },
    getModel: function (sName) {
      return this.getView().getModel(sName);
    },
    getModelFromManifest: function (sName) {
      return this.getOwnerComponent().getModel(sName);
    },
    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

  });
});