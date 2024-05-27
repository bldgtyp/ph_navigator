import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import ProjectCard, { ProjectDataType } from './ProjectCard';
import { Dialog } from '@mui/material';
import MoonLoader from "react-spinners/MoonLoader";
import { getProjectListData } from '../../api/team_view';

const TOKEN = process.env.REACT_APP_PH_NAV_AIRTABLE_TEST_TOKEN

function TeamView() {
    const { teamId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }]);

    useEffect(() => {
        async function getProjectListingData() {
            try {
                console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
                console.log(`Loading '${teamId}' TeamView Project List`);
                console.log(`process.env.REACT_APP_TEST_GH_ACCESS_KEY: ${TOKEN}`,);
                const projectList = await getProjectListData(teamId, TOKEN)
                setProjectDataList(projectList || [])
            } catch (error) {
                alert(`Error getting project listing: ${error}`);
            }
            finally {
                setIsLoading(false);
                console.log(`Done loading '${teamId}' TeamView Project List.`)
            }
        }

        getProjectListingData()

    }, [teamId]);

    return (
        <div className="project-browser-cards">
            <Dialog className="model-loading" open={isLoading}>
                <div className="model-loading">
                    <div>Please wait while the Team&apos;s Projects are Loaded.</div>
                    <MoonLoader
                        color="#1976d2"
                        cssOverride={{
                            display: "block",
                            margin: "0 auto",
                            padding: "8px",
                        }}
                        size="25px"
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </Dialog>
            {!isLoading && (
                <>
                    {projectDataList.map((d) => {
                        return <ProjectCard {...d} key={d.identifier} teamId={teamId} />;
                    })}
                </>
            )}
        </div>
    );
}

export default TeamView;