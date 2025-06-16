import { h, Component } from "https://esm.sh/preact";
import htm from 'https://esm.sh/htm';

export class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
    this.html = htm.bind(h);
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return this.html`<span>${time}</span>`;
  }
}