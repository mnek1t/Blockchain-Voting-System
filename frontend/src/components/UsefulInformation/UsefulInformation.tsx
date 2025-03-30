import usefulData from "./usefulData";
import "./usefulInformation.css"
interface LinkData {
    url: string;
    label: string;
  }

const UsefulInformation = () => {
    const renderTextWithInternalReferences = (text: string, links: LinkData[] | null) => {
        if(!links || links.length === 0) return text;
        let updText = text;
        links.forEach(link => {
            const regex = new RegExp(`<a>${link.label}</a>`, 'g');
            updText = updText.replace(regex, `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`);
        })

        return <span dangerouslySetInnerHTML={{ __html: updText }} />;
    }

    return(
        <div className="usefulinfo-container">
            <h2>Useful Information</h2>
            <ul>
                {usefulData.map((item, index) => (
                    <>
                        <li key={index}>{renderTextWithInternalReferences(item.text, item.links)}</li>
                        <hr/>
                    </>
                ))}
            </ul>
            <br/><br/>
        </div>
    );
}

export default UsefulInformation;