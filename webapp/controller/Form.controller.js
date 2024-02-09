sap.ui.define([
    'projectdes/controller/BaseController',
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/BusyIndicator'
], function (BaseController, Fragment, JSONModel, MessageBox, BusyIndicator) {
    "use strict";

    return BaseController.extend("projectdes.controller.Form", {

        onInit: function () {


            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteViewForm").attachMatched(this._onRouteMatched, this);
            this._setNewId();


        },
        _onRouteMatched: function (oEvent) {
            let oArgs = oEvent.getParameter("arguments");
            let sID = decodeURIComponent(oArgs.id);
            let sMode = decodeURIComponent(oArgs.mode);
            let oModel = this.getModelFromManifest();
        

            oModel.read("/Products(" + sID + ")", {
                urlParameters: {
                    "$expand": "Category,Supplier" // Obtener categoria y supplier
                },
                success: function (oData) {
                    let oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(oData);
                    this.setModel(oJsonModel, "modelView");
                    
                    let oForm = this.getView().byId("form");

                    oForm.setModel(this.getModel("modelView"));
                }.bind(this),
                error: function (oError) {
                    // Mostrar un mensaje de toast en caso de error durante la lectura
                    MessageToast.show("Error al leer los datos: " + oError.message);
                }
            });

            if (sMode === "create") {
                // Si create poner el modo create
                this._editMode("create");
            } else if (sMode === "view") {
                this._editMode("view");
            }
        },

        handleEditPress: function () {

            this._editMode("edit");

        },

        handleCancelPress: function () {


            this._editMode("view");

        },

        handleSavePress: function () {

            this._editMode("view");
            let sID = this.getView().byId("IDText").getText();
            let sName = this.getView().byId("nameInput").getValue();
            let sDescription = this.getView().byId("descInput").getValue();
            let sPrice = this.getView().byId("priceInput").getValue();
            let sRating = this.getView().byId("ratingInput").getValue();
            let sDateRd = this.getView().byId("dateRD").getValue();
            let sDateDD = this.getView().byId("dateDD").getValue();
            

            let oEntry = {
                ID: sID,
                Name: sName,
                Description: sDescription,
                Price: sPrice,
                Rating: sRating,
                ReleaseDate: sDateRd,
                DiscontinuedDate: sDateDD

            };
            let rgl = this.getView().byId("rgl");
            rgl.setBusy(true);
            let oModel = this.getModelFromManifest();
            
            oModel.update("/Products(" + oEntry.ID + ")", oEntry, {
                method: "PUT",
                success: function (data) {
                    rgl.setBusy(false);
                    MessageBox.success("El producto ha sido modificado correctamente!");

                },
                error: function (e) {
                    rgl.setBusy(false);
                    MessageBox.error("El producto no ha podido ser modificado");

                }
            });
        },

        _editMode: function (bEditMode) {

            // Método privado para cambiar la visibilidad de los controles según el modo de edición

            if (bEditMode === "create") {
                //Visión modo crear
                this.getView().byId("edit").setVisible(false);
                this.getView().byId("save").setVisible(false);
                this.getView().byId("cancel").setVisible(false);
                this.getView().byId("saveCreate").setVisible(true);

                this.getView().byId("feName1").setVisible(false);
                this.getView().byId("feDesc1").setVisible(false);
                this.getView().byId("fePrice1").setVisible(false);
                this.getView().byId("feRating1").setVisible(false);
                this.getView().byId("feRD1").setVisible(false);
                this.getView().byId("feDD1").setVisible(false);
                this.getView().byId("feName").setVisible(false);
                this.getView().byId("feDesc").setVisible(false);
                this.getView().byId("fePrice").setVisible(false);
                this.getView().byId("feRating").setVisible(false);
                this.getView().byId("feRD").setVisible(false);
                this.getView().byId("feDD").setVisible(false);
                this.getView().byId("feCat").setVisible(false);
                this.getView().byId("feSupplier").setVisible(false);
                this.getView().byId("feID").setVisible(false);

                this.getView().byId("newID").setVisible(true);
                this.getView().byId("NewName").setVisible(true);
                this.getView().byId("NewDesc").setVisible(true);
                this.getView().byId("NewPrice").setVisible(true);
                this.getView().byId("NewRating").setVisible(true);
                this.getView().byId("feDD1New").setVisible(true);
                this.getView().byId("feRD1New").setVisible(true);

            } else if (bEditMode === "edit") {
                //Visión modo editar
                this.getView().byId("edit").setVisible(true);
                this.getView().byId("save").setVisible(true);
                this.getView().byId("cancel").setVisible(true);
                this.getView().byId("saveCreate").setVisible(false);

                this.getView().byId("feName1").setVisible(true);
                this.getView().byId("feDesc1").setVisible(true);
                this.getView().byId("fePrice1").setVisible(true);
                this.getView().byId("feRating1").setVisible(true);
                this.getView().byId("feRD1").setVisible(true);
                this.getView().byId("feDD1").setVisible(true);
                this.getView().byId("feCat").setVisible(true);
                this.getView().byId("feSupplier").setVisible(true);
                this.getView().byId("feID").setVisible(true);
                this.getView().byId("feName").setVisible(false);
                this.getView().byId("feDesc").setVisible(false);
                this.getView().byId("fePrice").setVisible(false);
                this.getView().byId("feRating").setVisible(false);
                this.getView().byId("feRD").setVisible(false);
                this.getView().byId("feDD").setVisible(false);

                this.getView().byId("newID").setVisible(false);
                this.getView().byId("NewName").setVisible(false);
                this.getView().byId("NewDesc").setVisible(false);
                this.getView().byId("NewPrice").setVisible(false);
                this.getView().byId("NewRating").setVisible(false);
                this.getView().byId("feDD1New").setVisible(false);
                this.getView().byId("feRD1New").setVisible(false);
            } else if (bEditMode === "view") {
                //Visión modo lectura
                this.getView().byId("edit").setVisible(true);
                this.getView().byId("save").setVisible(false);
                this.getView().byId("cancel").setVisible(false);
                this.getView().byId("saveCreate").setVisible(false);

                this.getView().byId("feName1").setVisible(false);
                this.getView().byId("feDesc1").setVisible(false);
                this.getView().byId("fePrice1").setVisible(false);
                this.getView().byId("feRating1").setVisible(false);
                this.getView().byId("feRD1").setVisible(false);
                this.getView().byId("feDD1").setVisible(false);
                this.getView().byId("feName").setVisible(true);
                this.getView().byId("feDesc").setVisible(true);
                this.getView().byId("fePrice").setVisible(true);
                this.getView().byId("feRating").setVisible(true);
                this.getView().byId("feRD").setVisible(true);
                this.getView().byId("feDD").setVisible(true);
                this.getView().byId("feCat").setVisible(true);
                this.getView().byId("feSupplier").setVisible(true);
                this.getView().byId("feID").setVisible(true);

                this.getView().byId("newID").setVisible(false);
                this.getView().byId("NewName").setVisible(false);
                this.getView().byId("NewDesc").setVisible(false);
                this.getView().byId("NewPrice").setVisible(false);
                this.getView().byId("NewRating").setVisible(false);
                this.getView().byId("feDD1New").setVisible(false);
                this.getView().byId("feRD1New").setVisible(false);
            }


        },
        handleSaveCreatePress: function () {
            let rgl = this.getView().byId("rgl");
            rgl.setBusy(true);
            let oModel = this.getModel();
            let oEntry = {};

            oEntry.ID = this.getView().byId("IDNew").getText();
            oEntry.Name = this.getView().byId("namenewInput").getValue();
            oEntry.Description = this.getView().byId("descnewInput").getValue();
            oEntry.Price = this.getView().byId("pricenewInput").getValue();
            oEntry.Rating = this.getView().byId("ratingnewInput").getValue();
            oEntry.ReleaseDate = this.getView().byId("dateRDNew").getValue();
            oEntry.DiscontinuedDate = this.getView().byId("dateDDNew").getValue();

            


            oModel.create("/Products", oEntry, {
                method: "POST",
                success: function (data) {
                    this._setNewId();
                    this.getView().byId("namenewInput").setValue("");
                    this.getView().byId("descnewInput").setValue("");
                    this.getView().byId("pricenewInput").setValue("");
                    this.getView().byId("ratingnewInput").setValue("");
                    
                    MessageBox.success("El producto ha sido creado correctamente!");
                    rgl.setBusy(false);
                }.bind(this),
                error: function (e) {
                    
                    MessageBox.error("El producto no ha podido ser creado");
                    rgl.setBusy(false);
                }.bind(this)
            });
        },
        _setNewId: function () {
            // Obtener modelo
            let oModel = this.getModelFromManifest();

            // Leer los productos
            oModel.read("/Products", {
                success: function (oData) {
                    // Encontrar el id máximo dentro de los resultados dentro de productos
                    let maxId = Math.max(...oData.results.map(product => product.ID));

                    // Calcular nuevo ID
                    let newID = maxId + 1;
                   

                    // Settear nuevo ID en el texto
                    this.getView().byId("IDNew").setText(newID.toString());
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error reading data: " + oError.message);
                }
            });
        },


    });

});