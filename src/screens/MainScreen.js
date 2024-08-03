import SideBar from './SideBar';
import Navbar from './Navbar';
import NavT from './NavT';




const  MainScreen = () => {
    

    return (
        <div className="wrapper">
            <SideBar/>
            <div class="main-panel">
                <div class="main-header">
                    <Navbar/>
                </div>
                
            </div>     
        </div>
    );
};

export default MainScreen;
