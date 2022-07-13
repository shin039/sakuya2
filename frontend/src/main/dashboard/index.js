// -----------------------------------------------------------------------------
// Import
// -----------------------------------------------------------------------------
import Grid  from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import DisplayFrame from 'component/DisplayFrame/MultiPanel';
import Chart        from './Chart';
import Deposits     from './Deposits';
import Orders       from './Orders';


// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const Dashboard = () => {

  return (
    <DisplayFrame title='Dashboard'>
      <Grid container spacing={3}>

        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>

        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits />
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid>

      </Grid>
    </DisplayFrame>
  );
}

export default Dashboard;
