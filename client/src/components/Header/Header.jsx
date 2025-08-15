import './Header.css'
import sparkLogo from '../../assets/spark-logo.png';

function Header(){

    return(

        <>
        
        <div className="header-container">
            <img src={sparkLogo} alt="Spark Logo" className="header-logo" />
            <ul className="nav-items-list">
                <li className="nav-item">
                    <a href='/upload'>Dosya Yükle</a>
                </li>
                <li className="nav-item">
                    <a href='/record-list'>Tüm Kayıtlar</a>
                </li>
            </ul>
        </div>

        </>

    )

}

export default Header;