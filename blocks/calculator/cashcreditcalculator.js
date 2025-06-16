import { h, Component } from "https://esm.sh/preact";
import htm from 'https://esm.sh/htm';

export class CashCreditCalculator extends Component {

      constructor() {
        super();
        this.html = htm.bind(h);
      }

       markup() {
        return (
            this.html`
                <div class="creditcalculator">
                <div class="container">
                    <section class="calculator-section">
                        <div class="slider-container">
                            <label for="loanAmount">I want a loan in the following amount (RSD): <span id="loanAmountLabel">100.000</span></label>
                            <input type="range" id="loanAmount" min="10000" max="1000000" step="10000" value="100000">
                        </div>
                        <div class="slider-container">
                            <label for="loanPeriod">I want to pay it out in (months): <span id="loanPeriodLabel">18</span></label>
                            <input type="range" id="loanPeriod" min="6" max="60" step="1" value="18"></div>
                    </section>
                    <div class="summary">
                        <div>Credit: <span id="creditOutput">100.000 RSD</span></div>
                        <div>Payout period: <span id="periodOutput">18 months</span></div>
                        <div>Monthly rate: <span id="monthlyPaymentOutput">6.164,50 RSD</span></div>
                    </div>
                    <div class="note">Kreditni kalkulator je informativnog karaktera i ne predstavlja zvaničnu ponudu banke.</div>
                    </div>
                </div>
            `
        );
      }

      render() {
        const markup = this.markup();
        console.log(markup);
        
        return markup;
      }

}