sap.ui.define([
    'projectdes/controller/BaseController',
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, ODataModel, MessageToast, MessageBox, JSONModel) {
        "use strict";

        return BaseController.extend("projectdes.controller.productos", {
            onInit: function () {
               
                this._setData();
                this._editData();
              
            },
            _setData: function () {
                 // Obtener el modelo OData del componente propietario
                 let oModel = this.getModelFromManifest();
 
            },
            _editData: function () {
                 // Crear un modelo JSON para controlar el estado de edición
                 this._oViewModel = new JSONModel({
                    editMode: false
                });
                this.setModel(this._oViewModel, "viewModel");
            },

            onOpenMain: function () {
                // Obtener el enrutador y navegar a la ruta "RouteMain"
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            },

            onCrear: function () {
                // Obtener el modelo desde la vista
                let oModel = this.getModel();
                let oEntry = {};

                // Asignar valores a las propiedades del nuevo producto desde la vista
                oEntry.Name = this.getView().byId("inputNamecell").getValue();
                oEntry.Description = this.getView().byId("inputDescriptioncell").getValue();
                oEntry.Price = this.getView().byId("inputPricecell").getValue();
                oEntry.Rating = this.getView().byId("inputRatingcell").getValue();

           
            },

            onEdit: function () {
                // Obtener el modelo de vista y establecer el modo de edición en true
                let oViewModel = this.getModel("viewModel");
                oViewModel.setProperty("/editMode", true);
            },

            onCancel: function () {
                // Obtener el modelo de vista y restablecer el modo de edición en false
                let oViewModel = this.getModel("viewModel");
                oViewModel.setProperty("/editMode", false);

                // Obtener la tabla y quitar todas las selecciones
                let oTable = this.getView().byId("idProductsTable");
                oTable.removeSelections();
            },

            _toggleEditMode: function (bEditMode) {
                // Método privado para cambiar la visibilidad de los controles según el modo de edición
                this._oViewModel.setProperty("/editMode", bEditMode);

                // Obtener y mostrar/ocultar botones y campos según el modo de edición
                this.getView().byId("saveButton").setVisible(bEditMode);
                this.getView().byId("cancelButton").setVisible(bEditMode);
                this.getView().byId("crearButton").setVisible(!bEditMode);
                this.getView().byId("newRowButton").setVisible(!bEditMode);

                // Obtener y mostrar/ocultar campos de entrada y etiquetas según el modo de edición
                this.getView().byId("inputNamecell").setVisible(bEditMode);
                this.getView().byId("inputDescriptioncell").setVisible(bEditMode);
                this.getView().byId("inputPricecell").setVisible(bEditMode);
                this.getView().byId("inputRatingcell").setVisible(bEditMode);

                this.getView().byId("OIName").setVisible(!bEditMode);
                this.getView().byId("OIDescription").setVisible(!bEditMode);
                this.getView().byId("OIPrice").setVisible(!bEditMode);
                this.getView().byId("OIRating").setVisible(!bEditMode);

                // Si no está en modo de edición, copiar valores de etiquetas a campos de entrada
                if (!bEditMode) {
                    this.getView().byId("inputNamecell").setValue(this.getView().byId("OIName").getText());
                    this.getView().byId("inputDescriptioncell").setValue(this.getView().byId("OIDescription").getText());
                    this.getView().byId("inputPricecell").setValue(this.getView().byId("OIPrice").getText());
                    this.getView().byId("inputRatingcell").setValue(this.getView().byId("OIRating").getText());
                }
            },

            onSave: function () {
                // Obtener la tabla y las filas seleccionadas
                let oTable = this.getView().byId("idProductsTable");
                let aSelectedItems = oTable.getSelectedItems();

                // Verificar si solo hay una fila seleccionada
                if (aSelectedItems.length === 1) {
                    // Obtener las celdas de la fila seleccionada
                    let oSelectedRow = aSelectedItems[0];
                    let oID = oSelectedRow.getCells()[0];
                    let oName = oSelectedRow.getCells()[1].getItems()[1];
                    let oInputDescription = oSelectedRow.getCells()[2].getItems()[1];
                    let oInputPrice = oSelectedRow.getCells()[3].getItems()[1];
                    let oInputRating = oSelectedRow.getCells()[4].getItems()[1];

                    // Obtener valores de las celdas y entradas
                    let sID = oID.getText();
                    let sName = oName instanceof sap.m.Input ? oName.getValue() || oName.getPlaceholder() : "";
                    let sDescription = oInputDescription instanceof sap.m.Input ? oInputDescription.getValue() || oInputDescription.getPlaceholder() : "";
                    let sPrice = oInputPrice instanceof sap.m.Input ? oInputPrice.getValue() || oInputPrice.getPlaceholder() : "";
                    let sRating = oInputRating instanceof sap.m.Input ? oInputRating.getValue() || oInputRating.getPlaceholder() : "";


                    // Obtener el modelo y crear un objeto de entrada
                    let oModel = this.getModel();
                    let oEntry = {
                        Name: sName,
                        ID: sID,
                        Description: sDescription,
                        Price: sPrice,
                        Rating: sRating
                    };

                    // Actualizar el producto en el modelo OData
                    oModel.update("/Products(" + oEntry.ID + ")", oEntry, {
                        method: "PUT",
                        success: function (data) {
                            MessageBox.success("El producto ha sido modificado correctamente!");
                        },
                        error: function (e) {
                            MessageBox.error("El producto no ha podido ser modificado");
                        }
                    });

                    // Obtener el modelo de vista y restablecer el modo de edición en false
                    let oViewModel = this.getModel("viewModel");
                    oViewModel.setProperty("/editMode", false);

                    // Quitar todas las selecciones de la tabla
                    oTable.removeSelections();
                } else {
                    // Mostrar un mensaje de error si no hay una fila seleccionada
                    sap.m.MessageBox.error("Por favor, selecciona una fila para guardar.");
                }
            },

            onBorrar: function () {
                // Obtener la tabla y las filas seleccionadas
                let oTable = this.getView().byId("idProductsTable");
                let aSelectedItems = oTable.getSelectedItems();

                // Verificar si solo hay una fila seleccionada
                if (aSelectedItems.length === 1) {
                    // Obtener el ID de la fila seleccionada
                    let id = aSelectedItems[0].getBindingContext().getProperty("ID");
                    // Obtener el modelo
                    let oModel = this.getModel();

                    // Eliminar el producto del modelo OData
                    oModel.remove("/Products(" + id + ")", {
                        method: "DELETE",
                        success: function (data) {
                            MessageBox.success("El producto ha sido borrado correctamente!");
                        },
                        error: function (e) {
                            MessageBox.error("No se ha podido borrar el producto");
                        }
                    });
                } else {
                    // Mostrar un mensaje de error si no hay una fila seleccionada
                    sap.m.MessageBox.error("Por favor, selecciona solo una fila para borrar.");
                    return;
                }
            },

            onNewRow: function () {
                // Obtener el modelo
                let oModel = this.getModel();
                // Obtener los productos del modelo
                let oProducts = oModel.getProperty("/");

                // Encontrar el ID máximo existente
                let maxId = -1;
                let maxIdProduct = null;

                for (let key in oProducts) {
                    if (oProducts.hasOwnProperty(key)) {
                        let currentProduct = oProducts[key];

                        if (currentProduct.ID > maxId) {
                            maxId = currentProduct.ID;
                            maxIdProduct = currentProduct;
                        }
                    }
                }

                // Calcular el nuevo ID
                let newID = maxId + 1;
                let oEntry = {
                    ID: newID,
                    Name: "",
                    Description: "",
                    Price: "0.0",
                    Rating: "0"
                };

                // Crear un nuevo producto en el modelo OData
                oModel.create("/Products", oEntry, {
                    method: "POST",
                    success: function (data) {
                        MessageBox.success("El registro ha sido creado correctamente!");
                    },
                    error: function (e) {
                       
                    }
                });

                // Limpiar los campos de entrada y establecer el modo de edición en true
                this.getView().byId("inputNamecell").setValue("");
                this.getView().byId("inputDescriptioncell").setValue("");
                this.getView().byId("inputPricecell").setValue("0.0");
                this.getView().byId("inputRatingcell").setValue("0");
                this.getModel("viewModel").setProperty("/editMode", true);
            },

        });
    });