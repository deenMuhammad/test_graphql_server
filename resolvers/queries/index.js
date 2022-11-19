const helloWorld = async (_, args, ctx) => {
  console.log(ctx);
  return "Hello, World!";
};

export { helloWorld };
