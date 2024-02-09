sap.ui.define([
    'projectdes/controller/BaseController',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (BaseController, JSONModel, MessageToast) {
        "use strict";


        return BaseController.extend("projectdes.controller.ProductosAnn", {

            onInit: function () {

                let oRouter = this.getRouter();
                oRouter.getRoute("RouteViewAnn").attachMatched(this._onRouteMatched, this);
                oRouter.getRoute("RouteMain").attachBeforeMatched(this._onMainView, this);
                let sName;



            },


            _onRouteMatched: function (oEvent) {


                let oArgs = oEvent.getParameter("arguments");
                let sID = decodeURIComponent(oArgs.id);

                this.sName = sID;
              
                this.setFilterData();

            },

            _onMainView: function () {

                let oSmartFilterBar = this.getView().byId("smartFilterBar");
                oSmartFilterBar.clear();
            },

            beforeRebindTable: function (oControlEvent){
               this.setFilterData();
            },
            setFilterData: function (){
                let oSmartBar = this.getView().byId("smartFilterBar");
                oSmartBar.setFilterData({
                    "Category.Name": this.sName
                });

                let oSmartTable = this.getView().byId("ProductsSmartTable");
               
                oSmartTable.rebindTable();
            }

        });
    });