import { Loading } from './loading';

export default {
  title: 'Atoms/Loading',
  component: Loading,
};

function Template(args) {
  return <Loading {...args} />;
}

export const Default = Template.bind({});
