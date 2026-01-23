import './dashboard-header.css'
import qcLogo from '../../assets/logos/qcg-logo.svg'
import ydoLogo from '../../assets/logos/ydo-logo.svg'

const DashboardHeader = () => {
    return (
        <header className='dashboard-header'>
            <img src={qcLogo} className='header-logo' alt='QC Government Logo'/>
                <h1 className='header-text'>QC SCHOLARSHIP PROGRAM DASHBOARD</h1>
            <img src={ydoLogo} className='header-logo' alt='YDO Logo'/>
        </header>
    )
}

export default DashboardHeader;