sap.ui.define([
    'projectdes/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast) {
        "use strict";

        return BaseController.extend("projectdes.controller.Universidad", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.getRouter().getRoute("RouteViewUni").attachPatternMatched(this._onRouteMatched, this);

            },
            _onRouteMatched: function (oEvent) {

                let oArgs = oEvent.getParameter("arguments");
                let sLang = decodeURIComponent(oArgs.lang);
                this.getView().byId("searchField").setValue(sLang);
                let that = this;
                let sApiUrl = "https://restcountries.com/v3.1/lang/" + sLang;
              
                $.ajax({
                    url: sApiUrl,
                    method: "GET",
                    success: function (data) {
                        // Check si API cargada correctamente
                      
                        let oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.setData(data);
                       
                        that.getView().setModel(oJsonModel, "modelView");
                        
                    },
                    error: function () {
                        let oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.loadData("https://restcountries.com/v3.1/all");
                        that.getView().setModel(oJsonModel, "modelView");

                        MessageToast.show("No se encuentran datos para el idioma: " + sLang);
                    }
                });

            },

            onOpenMain: function () {
                // Obtener el enrutador y navegar a la ruta "RouteMain"
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            },

            onSearch: function () {
                // Obtener el valor de búsqueda desde el campo de entrada
                let lang = this.getView().byId("searchField").getValue();
               

                // Obtener el modelo desde la vista con el nombre lógico "modelView"
                let oModel = this.getModel("modelView");

                // Cargar datos desde la URL de la API REST filtrados por el idioma
                oModel.loadData("https://restcountries.com/v3.1/lang/" + lang);

                // Establecer el modelo actualizado en la vista
                this.setModel(oModel, "modelView");

                
            },

            sortAsc: function () {
                // Ordenar la tabla en orden ascendente por el nombre común
                this.sortTable("name/common", false);
            },

            sortDesc: function () {
                // Ordenar la tabla en orden descendente por el nombre común
                this.sortTable("name/common", true);
            },

            sortTable: function (sColumn, bDescending) {
                // Obtener la vista y la tabla
                let oView = this.getView();
                let oTable = oView.byId("universityTable");

                // Obtener el enlace de datos de la tabla
                let oBinding = oTable.getBinding("rows");

                // Crear un conjunto de clasificadores con la columna y la dirección de clasificación
                let aSorters = [];
                aSorters.push(new sap.ui.model.Sorter(sColumn, bDescending));

                // Aplicar la clasificación a la tabla
                oBinding.sort(aSorters);
            },

            clearAllSortings: function () {
                // Limpiar todas las clasificaciones de la tabla
                let oTable = this.getView().byId("universityTable");
                let oBinding = oTable.getBinding("rows");

                oBinding.sort();
            }
        });
    });