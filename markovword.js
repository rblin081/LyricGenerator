String.prototype.tokenize = function() {
  return this.split(/\s+/);
}

Array.prototype.choice = function() {
  return this[Math.floor(Math.random()*this.length)]
}

// A MarkovGenerate object
function MarkovGeneratorWord(n, max) {
  // Order (or length) of each ngram
  this.n = n;
  // What is the maximum amount we will generate?
  this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  this.ngrams = {};
  // A separate array of possible beginnings to generated text
  this.beginnings = [];

  // A function to feed in text to the markov chain
  this.feed = function(text) {

    // We might have an array or not!
    var tokens;
    if (text instanceof Array) {
      tokens = text;
    } else {
      tokens = text.tokenize();
    }

    // Discard this line if it's too short
    if (tokens.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    var beginning = tokens.slice(0, this.n).join(' ');
    this.beginnings.push(beginning);

      // Now let's go through everything and create the dictionary
    for (var i = 0; i < tokens.length - this.n; i++) {
      // Usings slice to pull out N elements from the array
      gram = tokens.slice(i, i + this.n).join(' ');
      // What's the next element in the array?
      next = tokens[i + this.n];

      // Is this a new one?
      if (!this.ngrams[gram]) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  this.generate = function() {

    // Get a random beginning
    var current = this.beginnings.choice();

    // The output is now an array of tokens that we'll join later
    var output = current.tokenize();


    const phraseLength = Math.floor(Math.random() * (this.max - 1 + 1)) + 1;

    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams[current]) {
        // What are all the possible next tokens
        var possible_next = this.ngrams[current];
        // Pick one randomly
        var next = possible_next.choice();
        // Add to the output
        output.push(next);
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.slice(output.length - this.n, output.length).join(' ');
      } else {
        break;
      }
    }
    // Here's what we got!
    return output.join(' ');
  }
}
