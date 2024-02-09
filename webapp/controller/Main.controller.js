sap.ui.define([
    'projectdes/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return BaseController.extend("projectdes.controller.Main", {
            onInit: function () {
                
                
                let oModel = new JSONModel();
                this.setModel(oModel);
                this._loadAPI();
                this._setCategoriesData();
                console.log(this.getModel());
            },
           
            _setCategoriesData: function () {
                let that = this;
                let oModel = this.getModelFromManifest();
                oModel.read("/Categories", {
                    success: function (oData) {
                        
                        that.getView().getModel().setProperty("/categories", oData);


                    }.bind(this),
                    error: function (oError) {
                        // Mostrar un mensaje de toast en caso de error durante la lectura
                        MessageToast.show("Error al leer los datos: " + oError.message);
                    }
                });

            },
    
            _loadAPI: function () {
                let that = this;
                let sApiUrl = "https://dog.ceo/api/breeds/image/random";
    
                
                $.ajax({
                    url: sApiUrl,
                    method: "GET",
                    success: function (data) {
                        // Check si API cargada correctamente
                        if (data.status === "success") {
                            // Actualizar el modelo con la url de la imagen
                            that.getView().getModel().setProperty("/imageUrl", data.message);
                        } else {
                            MessageToast.show("No se pudo cargar imagen.");
                        }
                    },
                    error: function () {
                        MessageToast.show("No se pudo cargar imagen.");
                    }
                });
            },
            onOpenViewUni: function () {
                
                let sSelectedLang = this.getView().byId("inputV2").getValue();
                if (sSelectedLang === "") {
                    sap.m.MessageBox.error("Por favor, indica un idioma para poder navegar a la vista.");
                } else {
                    
                    this.getRouter().navTo("RouteViewUni", {
                        lang: sSelectedLang
                    }, false);
                    this.getView().byId("inputV2").setValue("");
                }
            },
            onOpenViewCat: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteViewCat")
            },
            onOpenViewProd: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteViewProd")
            },

            onOpenViewProdV2: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("RouteViewProdV2")
            },
            onOpenViewProdAnn: function (){
                
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                let oInputfield = this.getView().byId("inputprecio");
                let oComboBox = this.getView().byId("combobox");
                let sProducto = oComboBox.getValue();
              
                console.log(sProducto);
               
               
                oRouter.navTo("RouteViewAnn", {
                    id: sProducto
                   
                }, false);

              
                oComboBox.setValue("");
            },
          
        });
    });