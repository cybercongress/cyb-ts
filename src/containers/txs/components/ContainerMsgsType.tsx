function ContainerMsgsType({ type, children }) {
  return (
    <Pane
      borderRadius={5}
      display="flex"
      flexDirection="column"
      // boxShadow="0 0 5px #3ab793"
      marginBottom={20}
    >
      <Pane
        display="flex"
        gap="10px"
        marginBottom={20}
        fontSize="18px"
        alignItems="center"
      >
        Type: <MsgType type={type} />
      </Pane>
      <RowsContainer>{children}</RowsContainer>
    </Pane>
  );
}
