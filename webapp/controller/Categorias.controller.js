sap.ui.define([
    'projectdes/controller/BaseController',
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, MessageToast) {
        "use strict";

        return BaseController.extend("projectdes.controller.Categorias", {
            onInit: function () {
                this._setData();
               
                // Obtener el enrutador y suscribirse al evento "Matched" de la ruta "RouteMain"
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteMain").attachMatched(this._onRouteMatched, this);
            },
            _setData: function () {
                 // Obtener el modelo asociado al componente propietario (Owner Component)
                 let oModel = this.getModelFromManifest();
          

                 // Leer datos de la entidad "/Categories" del modelo OData
                 oModel.read("/Categories", {
                     success: function (oData) {
                         // Crear un modelo JSON y establecer los datos leídos
                         let oJsonModel = new sap.ui.model.json.JSONModel();
                         oJsonModel.setData(oData);
 
                         // Establecer el modelo en la vista con un nombre lógico "modelView"
                         this.setModel(oJsonModel, "modelView");
 
                        
                     }.bind(this),
                     error: function (oError) {
                         // Mostrar un mensaje de toast en caso de error durante la lectura
                         MessageToast.show("Error al leer los datos: " + oError.message);
                     }
                 });

                 
            },

            onOpenMain: function () {
                // Obtener el enrutador y navegar a la ruta "RouteMain"
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            },

            onOpenInfo: function (oEvent) {
                // Obtener el modelo del componente propietario
                let oModel = this.getModelFromManifest();

                // Obtener el ID de la categoría seleccionada desde el evento
                let sCategoryId = oEvent.getSource().getBindingContext("modelView").getProperty("ID");

                // Leer datos de la entidad "/Categories(ID)/Products" del modelo OData
                oModel.read("/Categories(" + sCategoryId + ")/Products", {
                    success: function (oData) {
                        // Crear un modelo JSON y establecer los datos leídos
                        let oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.setData(oData);

                        // Crear una vista fragmento XML y establecer el modelo en ella
                        let oView = this.getView();
                        let oFragment = sap.ui.xmlfragment(oView.getId(), "projectdes.view.Info", this);
                        oFragment.setModel(oJsonModel, "modelView");

                        // Agregar el fragmento como dependiente de la vista y abrirlo
                        oView.addDependent(oFragment);
                        oFragment.open();

                        
                    }.bind(this),
                    error: function (oError) {
                        // Mostrar un mensaje de toast en caso de error durante la lectura
                        MessageToast.show("Error al leer los datos: " + oError.message);
                    }
                });

            },

            onCloseDialog: function () {
                // Obtener la vista actual
                let oView = this.getView();

                // Obtener el fragmento por ID
                let oFragment = oView.byId("Info");

                // Cerrar y destruir el fragmento si existe
                if (oFragment) {
                    oFragment.close();
                    oFragment.destroy();
                } 
            },
        });
    });