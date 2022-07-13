// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import Grid       from '@mui/material/Grid';
import Paper      from '@mui/material/Paper';
import MultiPanel from 'component/DisplayFrame/MultiPanel';

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
export default function SinglePanel(args){
  const {children} = args;

  return (
    <MultiPanel {...args /* Propertyは引き継ぐ。 */}>
      {/* Main Component */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </MultiPanel>
  );
}
