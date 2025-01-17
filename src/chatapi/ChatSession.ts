import { Configuration, OpenAIApi } from "openai";
import { createMessageStore, MessageRole } from "./MessageStore";

function getOpenAIApi(apiKey: string) {
  // setup open ai api
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  return new OpenAIApi(configuration);
}

const RECIPE_PROMPT = `
  You are a helpful kitchen assistant. Answer questions about the following recipe withing 30 words.


  Ingredients

  For the Duxelles:

  3 pints (1 1/2 pounds) white button mushrooms

  2 shallots, peeled and roughly chopped

  4 cloves garlic, peeled and roughly chopped

  2 sprigs fresh thyme, leaves only

  2 tablespoons unsalted butter

  2 tablespoons extra-virgin olive oil

  Kosher salt and freshly ground black pepper
  For the Beef:

  One 3-pound center cut beef tenderloin (filet mignon), trimmed

  Extra-virgin olive oil

  Kosher salt and freshly ground black pepper

  12 thin slices prosciutto

  6 sprigs of fresh thyme, leaves only

  2 tablespoons Dijon mustard

  Flour, for rolling out puff pastry

  1 pound puff pastry, thawed if using frozen

  2 large eggs, lightly beaten

  1/2 teaspoon coarse sea salt

  Minced chives, for garnish

  Green Peppercorn Sauce, recipe follows

  Roasted Fingerling Potatoes with Fresh Herbs and Garlic, recipe follows

  Warm Wilted Winter Greens, recipe follows
  Green Peppercorn Sauce:

  2 tablespoons olive oil

  2 shallots, sliced

  2 cloves garlic, peeled and smashed

  3 sprigs fresh thyme, leaves only

  1 cup brandy

  1 box beef stock

  2 cups cream

  2 tablespoons grainy mustard

  1/2 cup green peppercorns in brine, drained, brine reserved
  Roasted Fingerling Potatoes with Fresh Herbs and Garlic:

  2 pints fingerling potatoes

  2 sprigs fresh rosemary

  2 to 3 sprigs fresh sage

  3 sprigs fresh thyme

  6 cloves garlic, left unpeeled

  3 tablespoons extra-virgin olive oil, plus for sheet pan

  Salt and pepper
  Warm Wilted Winter Greens:

  1/4 cup honey

  1/2 cup balsamic vinegar

  1/2 pint walnuts, for garnish

  3 bunches assorted winter greens (such as Swiss chard, radicchio, or escarole), washed, stemmed, and torn into pieces

  1 tablespoon grainy mustard

  Extra-virgin olive oil

  1/2 cup pomegranate seeds, for garnish

  Parmesan shavings, for garnish

  1 shallot, chopped, for garnish

  steps

  For the Duxelles:
  To make the Duxelles: Add mushrooms, shallots, garlic, and thyme to a food processor and pulse until finely chopped. Add butter and olive oil to a large saute pan and set over medium heat. Add the shallot and mushroom mixture and saute for 8 to 10 minutes until most of the liquid has evaporated. Season with salt and pepper and set aside to cool.
  
  For the Beef:
  To prepare the beef: Tie the tenderloin in 4 places so it holds its cylindrical shape while cooking. Drizzle with olive oil, then season with salt and pepper and sear all over, including the ends, in a hot, heavy-based skillet lightly coated with olive oil - about 2 to 3 minutes. Meanwhile set out your prosciutto on a sheet of plastic wrap (plastic needs to be about a foot and a half in length so you can wrap and tie the roast up in it) on top of your cutting board. Shingle the prosciutto so it forms a rectangle that is big enough to encompass the entire filet of beef. Using a rubber spatula cover evenly with a thin layer of duxelles. Season the surface of the duxelles with salt and pepper and sprinkle with fresh thyme leaves. When the beef is seared, remove from heat, cut off twine and smear lightly all over with Dijon mustard. Allow to cool slightly, then roll up in the duxelles covered prosciutto using the plastic wrap to tie it up nice and tight. Tuck in the ends of the prosciutto as you roll to completely encompass the beef. Roll it up tightly in plastic wrap and twist the ends to seal it completely and hold it in a nice log shape. Set in the refrigerator for 30 minutes to ensure it maintains its shape.
  Preheat oven to 425 degrees F.
  On a lightly floured surface, roll the puff pastry out to about a 1/4-inch thickness. Depending on the size of your sheets you may have to overlap 2 sheets and press them together. Remove beef from refrigerator and cut off plastic. Set the beef in the center of the pastry and fold over the longer sides, brushing with egg wash to seal. Trim ends if necessary then brush with egg wash and fold over to completely seal the beef - saving ends to use as a decoration on top if desired. Top with coarse sea salt. Place the beef seam side down on a baking sheet.
  Brush the top of the pastry with egg wash then make a couple of slits in the top of the pastry using the tip of a paring knife ¿ this creates vents that will allow the steam to escape when cooking. Bake for 40 to 45 minutes until pastry is golden brown and beef registers 125 degrees F on an instant-read thermometer. Remove from oven and rest before cutting into thick slices. Garnish with minced chives, and serve with Green Peppercorn Sauce, Roasted Fingerling Potatoes with Fresh Herbs and Garlic, and Warm Wilted Winter Greens.
  
  Green Peppercorn Sauce:
  Add olive oil to pan after removing beef. Add shallots, garlic, and thyme; saute for 1 to 2 minutes, then, off heat, add brandy and flambe using a long kitchen match. After flame dies down, return to the heat, add stock and reduce by about half. Strain out solids, then add 2 cups cream and mustard. Reduce by half again, then shut off heat and add green peppercorns.
  Roasted Fingerling Potatoes with Fresh Herbs and Garlic:
  Preheat oven to 500 degrees F and place a baking sheet inside to heat.
  Add potatoes, rosemary, sage, thyme, and garlic to a medium bowl. Drizzle with olive oil, and season with salt and pepper. Remove sheet pan from oven, lightly coat with olive oil, and pour potatoes onto pan. Place potatoes in oven and reduce heat to 425 degrees F. Roast for 20 minutes, or until crispy on outside and tender on inside.
  
  Warm Wilted Winter Greens:
  Cook honey and balsamic together over medium-high heat in a large saute pan, about 5 minutes. Toast walnuts in a small skillet; set aside to cool.
  Pile greens on a platter. Stir mustard into balsamic-honey dressing, then whisk in about 1 cup extra-virgin olive oil; pour over greens. Season greens with salt and pepper and garnish with walnuts, pomegranate seeds, shavings of Parmesan, and shallot.
  Use extreme caution when igniting alcohol. Remove the pan from the heat source before adding the alcohol. Pour the alcohol into the pan and carefully ignite with a match or click lighter. Return the pan to the heat and gently swirl to reduce the flames.

`;
// const INITIAL_PROMPT =
//   "You are a helpful kitchen assistant. Answer as conciesely and factually accurate as possible within 30 words.";

const INITIAL_PROMPT = RECIPE_PROMPT;

interface ChatSessionConfig {
  apiKey: string;
}
export async function createChatSession({ apiKey }: ChatSessionConfig) {
  const openai = getOpenAIApi(apiKey);

  // keyv for potentially saving data to database
  const messages = createMessageStore();

  const promptChatGPT = async (
    role: MessageRole = MessageRole.USER,
    prompt: string
  ) => {
    messages.add(role, prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages.getRecentMessages(),
    });

    if (completion.status !== 200) {
      console.error("Cannot access openai api");
      return;
    }

    const messageContent = completion.data.choices[0].message?.content;
    if (typeof messageContent === "undefined") {
      console.error("cannot read message content");
      console.log(completion.data);
      return;
    }

    messages.add(MessageRole.ASSISTANT, messageContent);

    console.log(messages.getRecentMessages());

    return messageContent;
  };

  const startConversation = async () => {
    await promptChatGPT(MessageRole.SYSTEM, INITIAL_PROMPT);
  };

  // init the conversation right away
  await startConversation();

  const send = async (prompt: string) => {
    return await promptChatGPT(MessageRole.USER, prompt);
  };

  const clearMessages = async () => {
    messages.clear();
    await startConversation();
  };

  return {
    send,
    clearMessages,
  };
}
