import './dashboardLoadingAnimation.css'

const LoadingAnimation = () => {
    return (
        <div className='loader'>
            <div className='circle'>
                <div className='dot'></div>
                <div className='outline'></div>
            </div>
            <div className='circle'>
                <div className='dot'></div>
                <div className='outline'></div>
            </div>
            <div className='circle'>
                <div className='dot'></div>
                <div className='outline'></div>
            </div>
            <div className='circle'>
                <div className='dot'></div>
                <div className='outline'></div>
            </div>
        </div>
        
    )
}

export default LoadingAnimation;