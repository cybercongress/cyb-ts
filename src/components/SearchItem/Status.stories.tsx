import { Meta, Story } from '@storybook/react';
import Status, { Props } from './status';

export default {
  title: 'Features/Search/Status',
  component: Status,
  // argTypes: {
  //   status: {
  //     control: {
  //       type: 'select',
  //       options: [
  //         'understandingState',
  //         'impossibleLoad',
  //         'availableDownload',
  //         'downloaded',
  //         'sparkApp',
  //         'legacy',
  //       ],
  //     },
  //   },
  // },
} as Meta;

// export default {
//   title: 'search/SearchItem',
//   component: SearchItem,
// } as Meta;

// const Template: Story<ComponentProps<typeof SearchItem>> = (args) => {
//   return (
//     <div style={{ width: 400 }}>
//       <SearchItem {...args} />
//     </div>
//   );
// };

const Template: Story<ComponentProps<typeof Props>> = (args) => (
  <Status {...args} />
);

export const Default = Template.bind({});
Default.args = {
  status: 'understandingState',
};
