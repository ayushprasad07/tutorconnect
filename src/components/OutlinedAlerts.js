import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Fade } from '@mui/material';

export default function OutlinedAlerts(props) {
  const capitalize = (word) => {
    if (word === "danger") word = "error";
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div style={{ height: '50px', marginBottom: '10px',marginTop:"70px" }}>
      <Fade in={!!props.alert} timeout={300}>
        <div style={{ height: '100%' }}>
          {props.alert && (
            <Stack sx={{ width: '100%', height: '100%' }}>
              <Alert variant="outlined" severity={props.alert.type}>
                <strong>{capitalize(props.alert.type)}</strong> | {props.alert.msg}
              </Alert>
            </Stack>
          )}
        </div>
      </Fade>
    </div>
  );
}
