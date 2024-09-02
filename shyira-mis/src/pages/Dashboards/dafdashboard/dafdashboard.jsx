import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/Dafnavigationbar';
import Overview from './Overview';
import ViewRequest from './UserRequisitions/ViewRequisition'
import ViewLogisticRequest from './requestOfLogistic/viewLogisticRequest'
import RecievedLogisticOrder from '../logisticdashboard/OrderSupply/RecievedOrder'
import ViewFuelRequest from './fuelRequest/fuelRequisition'
import ViewItems from '../DGdashboard/StockItem/viewitems'
import DafProfile from './DafProfile'
import './DafDashboard.css';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
     case 'view-request':
          return <ViewRequest />;
      case 'logistic-profile':
          return <DafProfile />;

          case 'view-stock-items':
            return <ViewItems/>
      case 'recieved-logistic-order':
         return <RecievedLogisticOrder />
     case 'view-logistic-request':
          return <ViewLogisticRequest />
     case 'view-fuel-request':
          return <ViewFuelRequest />;
          
      default:
        return <Overview />;
    }
  };

  return (
    <div className="daf-dashboard">
      <Navigation />
      <Navbar setCurrentPage={setCurrentPage} />

      <div className="dafcontent">
        {renderContent()}
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
