import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Stack, Slider, Typography } from "@mui/material";
import { hbEnergyOpaqueConstruction } from '../../types/honeybee_energy/construction/opaque';
import { fetchModelServer } from '../../hooks/fetchModelServer';

export async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
}

export function UValueSliders() {
    const { teamId, projectId, modelId } = useParams();
    const [constructions, setConstructions] = useState<hbEnergyOpaqueConstruction[]>([]);
    const SLIDER_MIN = 0.01;
    const SLIDER_MAX = 1;

    useEffect(() => {
        fetchWithModal<hbEnergyOpaqueConstruction[]>(`${teamId}/${projectId}/${modelId}/exterior_constructions`)
            .then(data => {
                if (data) { setConstructions(data); }
            });
    }, [teamId, projectId, modelId]);

    return (
        <>
            <p className="heading">U-Values (W/m2k)</p>
            <Stack direction="column">
                {constructions.map((construction, index) => (
                    // <PanelItem key={index} label={construction.identifier} value={construction.u_factor.toFixed(3)} />
                    <div key={index}>
                        <Typography className="slider-item-heading">
                            {construction.identifier}
                        </Typography>
                        <Slider
                            key={index}
                            defaultValue={Number(construction.u_factor.toFixed(3))}
                            step={0.01}
                            min={SLIDER_MIN}
                            max={SLIDER_MAX}
                            size="small"
                            valueLabelDisplay="auto"
                            color="secondary" />
                    </div>
                ))}
            </Stack>
        </>
    );
}
