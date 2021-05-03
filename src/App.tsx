import { Paper, Tab, Tabs } from '@material-ui/core';
import * as React from 'react';
import './App.css';
import BinsEditor from './components/BinsEditor';
import PackerView from './components/PackerView';

import BoxData from './core/BoxData';
import { ISize } from './types/Size';

enum AppTab {
  BIN_EDITOR,
  PACKER_VIEW
}

interface IAppState {
  tab: AppTab;
  packerSize: ISize;
  packerBins: BoxData[];
  animatePacker: boolean;
}

export default class App extends React.Component<{}, IAppState> {
  public state: IAppState = {
    tab: AppTab.BIN_EDITOR,
    packerSize: {
      length: 100,
      height: 30,
      width: 30
    },
    packerBins: [],
    animatePacker: true
  };

  public render() {
    const { tab, packerSize, packerBins, animatePacker } = this.state;

    return (
      <div>
        <Paper className="root">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Edit bins" value={AppTab.BIN_EDITOR} />
            <Tab label="3D View" value={AppTab.PACKER_VIEW} />
          </Tabs>
        </Paper>
        <div>{tab === AppTab.BIN_EDITOR ? (
          <BinsEditor packerSize={packerSize} packerBins={packerBins} setPackerSize={this.setPackerSize} setPackerBins={this.setPackerBins} />
        ) : (
          <PackerView size={packerSize} bins={packerBins} animate={animatePacker} />
        )}</div>
      </div>
    );
  }

  private handleTabChange = (event: any, newValue: any) => {
    this.setState({
      tab: newValue
    });
  };

  private setPackerSize = (packerSize: ISize) => {
    this.setState({ packerSize });
  }

  private setPackerBins = (packerBins: BoxData[]) => {
    this.setState({ packerBins });
  }
}
