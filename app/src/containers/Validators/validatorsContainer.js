import { Container } from 'unstated';

class ValidatorsContainer extends Container {
    state = {
        validators: [],
        showJailed: false,
        activeValidatorsCount: 0,
    };

    getValidators = async () => {
        let validators = await window.cyber.getValidators();

        validators = validators
            .slice(0)
            .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));

        const activeValidatorsCount = validators
            .filter(validator => !validator.jailed)
            .length;

        this.setState({
            validators,
            activeValidatorsCount,
        });
    };

    showActive = () => {
        this.setState({ showJailed: false });
    };

    showJailed = () => {
        this.setState({ showJailed: true });
    };
}

export default new ValidatorsContainer();
