import React from "react";
import { Badge, Box } from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/react";
const UserBadgeItem = (props) => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={1}
      pl={4}
      variant="solid"
      fontSize={14}
      className="bg-[#bf74f7]/[0.2]"
    >
      {props.user.name}
      <CloseButton  onClick={props.handleRemove} />
    </Box>
  );
};

export default UserBadgeItem;
