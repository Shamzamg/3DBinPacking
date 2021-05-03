import { Box, Container, Divider, Grid, IconButton, List, ListItem, ListItemSecondaryAction, Paper, TextField, Typography } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import * as React from 'react';

import BoxData from '../core/BoxData';
import { ISize } from '../types/Size';
import { range } from '../utils/Array';

export interface IBinsEditorProps {
    packerSize: ISize;
    setPackerSize: (packerSize: ISize) => void;
    packerBins: BoxData[];
    setPackerBins: (packerBox: BoxData[]) => void;
}

export default class BinsEditor extends React.Component<IBinsEditorProps> {
    public render() {
        const { packerSize, packerBins } = this.props;

        return (
            <Container>
                <Box mt={2}>
                    <Paper>
                        <Box m={2} mb={1} pt={2}>
                            <Typography variant="h5" component="h2">
                                Container
                            </Typography>
                        </Box>
                        <Box p={2}>
                            <Grid item xs={12}>
                                <Grid container justify="flex-start" spacing={1}>
                                    <Grid item>
                                        <TextField id="length" label="Length" 
                                            value={packerSize.length ? packerSize.length.toString() : ''} 
                                            onChange={this.handleContainerLengthChange}
                                            type="number" variant="outlined" size="small" />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="height" label="Height" 
                                            value={packerSize.height ? packerSize.height.toString() : ''} 
                                            onChange={this.handleContainerHeightChange}
                                            type="number" variant="outlined" size="small" />
                                    </Grid>
                                    <Grid item>
                                        <TextField id="width" label="Width" 
                                            value={packerSize.width ? packerSize.width.toString() : ''} 
                                            onChange={this.handleContainerWidthChange}
                                            type="number" variant="outlined" size="small" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
                <Box mt={2}>
                    <Paper>
                        <Box m={2} pt={2}>
                            <Typography variant="h5" component="h2">
                                Items
                            </Typography>
                        </Box>
                        <List>{range(packerBins.length + 1).map(idx => (
                            <div key={idx}>
                                <ListItem role={undefined} dense>
                                    <Grid item xs={12}>
                                        <Grid container justify="flex-start" spacing={1}>
                                            <Grid item>
                                                <TextField id={`tag-${idx}`} label="Tag" 
                                                    value={idx < packerBins.length ? packerBins[idx].tag : ''} 
                                                    onChange={this.handleBinTagChange(idx)} 
                                                    variant="outlined" size="small" />
                                            </Grid>
                                            <Grid item>
                                                <TextField id={`length-${idx}`} label="Length"
                                                    value={idx < packerBins.length && packerBins[idx].length ? packerBins[idx].length.toString() : ''} 
                                                    onChange={this.handleBinLengthChange(idx)}
                                                    type="number" variant="outlined" size="small" />
                                            </Grid>
                                            <Grid item>
                                                <TextField id={`height-${idx}`} label="Height" 
                                                    value={idx < packerBins.length && packerBins[idx].height ? packerBins[idx].height.toString() : ''} 
                                                    onChange={this.handleBinHeightChange(idx)}
                                                    type="number" variant="outlined" size="small" />
                                            </Grid>
                                            <Grid item>
                                                <TextField id={`width-${idx}`} label="Width" 
                                                    value={idx < packerBins.length && packerBins[idx].width ? packerBins[idx].width.toString() : ''} 
                                                    onChange={this.handleBinWidthChange(idx)}
                                                    type="number" variant="outlined" size="small" />
                                            </Grid>
                                            <Grid item>
                                                <TextField id={`quantity-${idx}`} label="Quantity" 
                                                    value={idx < packerBins.length && packerBins[idx].quantity ? packerBins[idx].quantity.toString() : ''} 
                                                    onChange={this.handleBinQuantityChange(idx)}
                                                    type="number" variant="outlined" size="small" />
                                            </Grid>
                                        </Grid>
                                    </Grid> 
                                    {idx < packerBins.length ? (
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="remove" onClick={this.handleBinRemove(idx)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    ) : ''}
                                </ListItem>
                                {idx < packerBins.length ? (
                                <Divider />
                                ) : ''}
                            </div>
                        ))}
                        </List>
                    </Paper>
                </Box>
            </Container>
        );
    }

    private handleContainerLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerSize, setPackerSize } = this.props;
        packerSize.length = Math.max(0, e.target.valueAsNumber || 0);
        setPackerSize(packerSize);
    }
    private handleContainerHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerSize, setPackerSize } = this.props;
        packerSize.height = Math.max(0, e.target.valueAsNumber || 0);
        setPackerSize(packerSize);
    }
    private handleContainerWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerSize, setPackerSize } = this.props;
        packerSize.width = Math.max(0, e.target.valueAsNumber || 0);
        setPackerSize(packerSize);
    }

    private handleBinTagChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        if(idx === packerBins.length) {
            packerBins.push(new BoxData());
        }
        packerBins[idx].tag = e.target.value;
        setPackerBox(packerBins);
    }
    private handleBinLengthChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        if(idx === packerBins.length) {
            packerBins.push(new BoxData());
        }
        packerBins[idx].length = Math.max(0, e.target.valueAsNumber || 0);
        setPackerBox(packerBins);
    }
    private handleBinHeightChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        if(idx === packerBins.length) {
            packerBins.push(new BoxData());
        }
        packerBins[idx].height = Math.max(0, e.target.valueAsNumber || 0);
        setPackerBox(packerBins);
    }
    private handleBinWidthChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        if(idx === packerBins.length) {
            packerBins.push(new BoxData());
        }
        packerBins[idx].width = Math.max(0, e.target.valueAsNumber || 0);
        setPackerBox(packerBins);
    }
    private handleBinQuantityChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        if(idx === packerBins.length) {
            packerBins.push(new BoxData());
        }
        packerBins[idx].quantity = Math.max(0, e.target.valueAsNumber || 0);
        setPackerBox(packerBins);
    }

    private handleBinRemove = (idx: number) => () => {
        const { packerBins, setPackerBins: setPackerBox } = this.props;
        packerBins.splice(idx, 1);
        setPackerBox(packerBins);
    }
}
