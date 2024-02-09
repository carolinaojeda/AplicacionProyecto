sap.ui.define([
    'projectdes/controller/BaseController',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/m/MessageBox',
    'sap/ui/export/Spreadsheet',
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, MessageBox, Spreadsheet, MessageToast) {
        "use strict";

        return BaseController.extend("projectdes.controller.ProductosV2", {
            onInit: function () {
                this._setNorthWindData();
                this._setProductosData();
                this._setMaxId();
                let id;

            },
            _setProductosData: function () {
                let oModel = this.getModelFromManifest();

            },
            _setNorthWindData: function () {
                let oNorthwind = this.getModelFromManifest("Northwind");
                oNorthwind.read("/Products", {
                    success: function (oData) {
                        // Crear un modelo JSON y establecer los datos leídos
                        let oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.setData(oData);

                       
                        this.setModel(oJsonModel, "modelView");


                    }.bind(this),
                    error: function (oError) {
                        // Mostrar un mensaje de toast en caso de error durante la lectura
                        MessageToast.show("Error al leer los datos: " + oError.message);
                    }
                });
            },
            onBeforeExport: function (oEvt) {
                let mExcelSettings = oEvt.getParameter("exportSettings");
                if (mExcelSettings.url) {
                    return;
                }

                mExcelSettings.worker = false;
            },

            onOpenForm: function (oEvent) {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // Obtener el ID de la fila en la que esta el botón presionado
                let sId = oEvent.getSource().getBindingContext().getProperty("ID");

                //navegar hacia la vista enviandole el parámetro
                oRouter.navTo("RouteViewForm", {
                    id: sId,
                    mode: "view"
                }, false);


            },
            onCrear: function () {

                let sId = "0";
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteViewForm", {
                    id: sId,
                    mode: "create"
                }, false);

            },
            onBorrar: function (oEvent) {
                //get id del proyecto de la fila presionada
                let sId = oEvent.getSource().getBindingContext().getProperty("ID");

                let oModel = this.getModelFromManifest();
                oModel.read("/Products(" + sId + ")", {
                    success: function (oData) {
                        let oJsonModel = new sap.ui.model.json.JSONModel();
                        oJsonModel.setData(oData);
                        let oFragment = sap.ui.xmlfragment(this.getView().getId(), "proyectofinal.view.Borrar", this);
                        oFragment.setModel(oJsonModel, "modelView");

                        this.getView().addDependent(oFragment);
                        oFragment.open();

                    }.bind(this),
                    error: function (oError) {
                        // Mostrar un mensaje de toast en caso de error durante la lectura
                        MessageToast.show("Error al leer los datos: " + oError.message);
                    }
                });


            },
            onDeleteConfirm: function (oEvent) {
                let oFragment = this.getView().byId("Borrar");
                let sID = oFragment.getModel("modelView").getProperty("/ID");

                let oModel = this.getModelFromManifest();
                oModel.remove("/Products(" + sID + ")", {
                    method: "DELETE",
                    success: function (data) {
                        MessageBox.success("El producto ha sido borrado correctamente!");
                    },
                    error: function (e) {
                        MessageBox.error("No se ha podido borrar el producto");
                    }
                });
                this.onCloseDialog();

            },
            onCloseDialog: function () {
                let oView = this.getView();
                let oFragment = oView.byId("Borrar");

                if (oFragment) {
                    oFragment.close();
                    oFragment.destroy();
                }
            },
            onNewRow: async function () {

                //obtenemos la tabla 1
                let oTable = this.getView().byId("idProductsTable");
                let oModel = this.getModel();
               

                oTable.setBusy(true);
                //obtenemos items seleccionados en la tabla 1
                let aSelectedItems = oTable.getSelectedItems();
               

                //no dejar al usuario dar al botón si ninguna fila seleccionada
                if (aSelectedItems.length === 0) {
                    MessageBox.warning("Por favor, selecciona al menos un producto.");
                    oTable.setBusy(false);
                    return;
                } else if (aSelectedItems.length === 1) {
                    
                    await this._setMaxId();
                    let oSelectedRow = aSelectedItems[0];
                   
                    let oName = oSelectedRow.getCells()[1];
                    let oPrice = oSelectedRow.getCells()[2];
                  
                    // Obtener valores de las celdas y entradas
                    this._contadorId();
                 
                    let sID = this.id;
                    this.id=sID;
                   
                    let sName = oName.getText();
                    let sPrice = oPrice.getText();
                    let oEntry = {
                        Name: sName,
                        ID: sID,
                        Price: sPrice
                    };

                    oModel.create("/Products", oEntry, {
                        method: "POST",
                         success: function (data) {
                            oTable.setBusy(false);
                            MessageBox.success("El producto se ha creado correctamente!");
                  }.bind(this),
                         error: function (e) {
                            oTable.setBusy(false);
                            MessageBox.error("No se ha podido crear el producto.");
                         }.bind(this)
                     });
                } else {

                    let aEntries = [];
                   
                    
               
                    await this._setMaxId();
                    aSelectedItems.forEach(function (oSelectedRow) {
                        let oName = oSelectedRow.getCells()[1];
                        let oPrice = oSelectedRow.getCells()[2];
                       
                        // Obtener valores de las celdas y entradas
                        this._contadorId();
                     
                        let sID = this.id;
                        this.id=sID;
                     
                        let sName = oName.getText();
                        let sPrice = oPrice.getText();

                        // Crear un objeto de entrada
                        let oEntry = {
                            Name: sName,
                            ID: sID,
                            Price: sPrice
                        };

                       

                        aEntries.push(oEntry);
                    }.bind(this));
                

                    aEntries.forEach(function (oEntry) {
                        oModel.create("/Products", oEntry, {
                           method: "POST",
                            success: function (data) {
                                oTable.setBusy(false);
                                MessageBox.success("Los productos se han creado correctamente!");
                     }.bind(this),
                            error: function (e) {
                                oTable.setBusy(false);
                                MessageBox.error("No se ha podido crear los productos.");
                            }.bind(this)
                        });
                    });
                   

                    oTable.setBusy(false);
                }

                oTable.removeSelections();

            },

            _setMaxId: function () {
                return new Promise((resolve, reject) => {
                    
                    let oModel = this.getModelFromManifest();
            
                    oModel.read("/Products", {
                        success: function (oData) {
                            let maxId = Math.max(...oData.results.map(product => product.ID));
                            this.id = maxId;
                            resolve(); // Resolve promise si se encuentra el ID
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error reading data: " + oError.message);
                            reject(); // Reject promise si hay un error
                        }
                    });
                });
            },
            _contadorId: function () {

                this.id = this.id + 1;

            }



        });
    });
