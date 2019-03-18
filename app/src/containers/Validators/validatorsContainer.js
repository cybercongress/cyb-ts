import { Container } from 'unstated';

class ValidatorsContainer extends Container {
    state = {
        validators: [],
        showJailed: false,
    };

    getValidators = async () => {
        const validators = await window.cyber.getValidators();

        this.setState({ validators });
    };

    showActive = () => {
        this.setState({ showJailed: false });
    };

    showJailed = () => {
        this.setState({ showJailed: true });
    };
}

export default new ValidatorsContainer();
