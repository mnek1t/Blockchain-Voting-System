const ElectionForm = () => {
    return(
        <>
            <form>
                <div>
                    <label htmlFor="start-date-input">Start date</label>
                    <input id="start-date-input" type="date"></input>

                    <label htmlFor="end-date-input">End date</label>
                    <input id="end-date-input" type="date"></input>
                </div>
                <div>
                    {/* <ImageUploader handleFileUpload={handleImageUpload} maxSizeMB="10" accept="image/*" initialImage={profileImage || null}/> */}
                    {/* <img src={} alt='candidate'></img> */}
                    <label htmlFor="candidate-name-input">Name</label>
                    <input id="candidate-name-input"></input>
                    <label htmlFor="candidate-party-input">Party</label>
                    <input id="candidate-party-input"></input>
                </div>
                <button>Add candidate</button>
            </form>
        </>
    )
}

export default ElectionForm;