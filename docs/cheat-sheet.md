# Query Cheat Sheet - GROQ

> Data query examples from [Sanity.io docs](https://www.sanity.io/docs/query-cheat-sheet).

Given a schema defined as follows, here is how you would replicate these queries using the query builder:

```ts
import { defineDocument } from 'sanity-typed-queries'

// This object is the type of the person document for use in the below builder
const { person } = defineDocument('person', {
  name: {
    type: 'string'
  }
})

const { builder: movie } = defineDocument('movie, {
  title: {
    type: 'string'
  },
  priority: {
    type: 'number'
  }
}, [person])

```

## Constraints

Coming soon.

## Slice Operations

- **a single item (an object is returned, not an array)**

  ```groq
  *[_type == "movie"][0]
  ```

  ```ts
  const [query] = movie.first().use()
  ```

- **first 6 items (inclusive)**

  ```groq
  *[_type == "movie"][0..5]
  ```

  ```ts
  const [query] = movie.select(0, 5).use()
  ```

- **first 5 items (non-inclusive)**

  ```groq
  *[_type == "movie"][0...5]
  ```

  ```ts
  const [query] = movie.select(0, 5, true).use()
  ```

- **first 10 item titles**

  ```groq
  *[_type == "movie"]{title}[0...10]
  ```

  ```ts
  const [query] = movie.pick(['title']).select(0, 10, true).use()
  ```

- **first 10 item titles**

  ```groq
  *[_type == "movie"][0...10]{title}
  ```

  ```ts
  const [query] = movie.pick(['title']).select(0, 10, true).use()
  ```

- **first 10 item titles, offset by 10**

  ```groq
  *[_type == "movie"][10...20]{title}
  ```

  ```ts
  const [query] = movie.pick(['title']).select(10, 20, true).use()
  ```

- **no slice specified -> all items are returned**
  ```groq
  *[_type == "movie"]
  ```
  ```ts
  const [query] = movie.use()
  ```

## Ordering

- **order results**

  ```groq
   *[_type == "movie"] | order(_createdAt asc)
  ```

  ```ts
  const [query] = movie.orderBy('_createdAt').use()
  ```

- **order todo items by descending priority, where priority is equal, list most recently updated item first**

  ```groq
  *[_type == "movie"] | order(priority desc, _updatedAt desc)
  ```

  ```ts
  const [query] = movie
    .orderBy('releaseDate', 'desc')
    .orderBy('_createdAt', 'desc')
    .use()
  ```

- **the single, oldest document**

  ```groq
  *[_type == "movie"] | order(_createdAt asc) [0]
  ```

  ```ts
  const [query] = movie.orderBy('_createdAt').first().use()
  ```

- **the single, newest document**

  ```groq
  *[_type == "movie"] | order(_createdAt desc) [0]
  ```

  ```ts
  const [query] = movie.orderBy('_createdAt', 'desc').first().use()
  ```

- **oldest 10 documents**
  ```groq
  *[_type == "movie"] | order(_createdAt asc) [0..9]
  ```
  ```ts
  const [query] = movie.orderBy('_createdAt').select(0, 9).use()
  ```

## Joins

- **fetch document with title and a custom map**

  Say `castMembers` is an array containing objects with character name and a reference to the person:
  We want to fetch movie with title and an attribute named "cast" which is an array of actor names

  ```groq
  *[_type=='movie']{title,'cast': castMembers[].person->name}
  ```

  ```ts
  const [query] = movie
    .map(h => ({ cast: h.castMembers.pick('person').resolve('name').use() }))
    .pick(['title', 'cast'])
    .use()
  ```

  Same query as above, except "cast" now contains objects with person.\_id and person.name

  ```groq
  *[_type=='movie']{title,'cast': castMembers[].person->{_id, name}}
  ```

  ```ts
  const [query] = movie
    .map(h => ({
      cast: h.castMembers.pick('person').resolve(['_id', 'name']).use(),
    }))
    .pick(['title', 'cast'])
    .use()
  ```

<!-- ```groq
// Fetch movies with title, and join with poster asset with path + url
*[_type=='movie']{title,poster{asset->{path,url}}}
``` -->
<!-- ```groq
// Using the ^ operator to refer to the enclosing document. Here ^._id refers to the id
// of the enclosing person record.
*[_type=="person"]{
  name,
  "relatedMovies": *[_type=='movie' && references(^._id)]{ title }
}
``` -->
<!-- ```groq
// Books by author.name (book.author is a reference)
*[_type == "book" && author._ref in *[_type=="author" && name=="John Doe"]._id ]{...}
``` -->

## Object Projections

- **return only title**

  ```groq
  *[_type == 'movie']{title}
  ```

  ```ts
  const [query] = movie.pick(['title']).use()
  ```

- **return values for multiple attributes**

  ```groq
  *[_type == 'movie']{_id, _type, title}
  ```

  ```ts
  const [query] = movie.pick(['_id', '_type', 'title']).use()
  ```

- **explicitly name the return field for \_id**

  ```groq
  *[_type == 'movie']{'renamedId': _id, _type, title}
  ```

  ```ts
  const [query] = movie
    .map(h => ({ renamedId: h._id.use() }))
    .pick(['renamedId', '_type', 'title'])
    .use()
  ```

- **Return an array of attribute values (no object wrapper)**

  ```groq
  *[_type == 'movie'].title
  *[_type == 'movie']{'characterNames': castMembers[].characterName}
  ```

  ```ts
  const [query] = movie.pick('title').use()
  const [secondQuery] = movie
    .map(h => ({ characterNames: h.castMembers.pick('characterName').use() }))
    .pick(['characterNames'])
    .use()
  ```

<!-- - **movie titled Arrival and its posterUrl**

  ```groq
  *[_type=='movie' && title == 'Arrival']{title,'posterUrl': poster.asset->url}
  ``` -->

- **Some computed attributes, then also add all attributes of the result**

  ```groq
  *[_type == 'movie']{'posterUrl': poster.asset->url, ...}
  ```

  ```ts
  const [query] = movie
    .map(h => ({ posterUrl: h.poster.asset.resolve('url').use() }))
    .use()
  ```

- **Default values when missing or null in document**

  ```groq
  *[_type == 'movie']{..., 'rating': coalesce(rating, 'unknown')}
  ```

  ```ts
  const [query] = movie.map(h => ({ rating: h.rating.use('unknown') })).use()
  ```

- **Number of elements in array 'actors' on each movie**

  ```groq
  *[_type == 'movie']{"actorCount": count(actors)}
  ```

  ```ts
  const [query] = movie
    .map(h => ({ actorCount: h.actors.count() }))
    .pick(['actorCount'])
    .use()
  ```

<!-- - **Apply a projection to every member of an array**

  ```groq
  *[_type == 'movie']{castMembers[]{characterName, person}}
  ``` -->

<!-- - **Filter embedded objects**

  ```groq
  *[_type == 'movie']{castMembers[characterName match 'Ripley']{characterName, person}}
  ``` -->

<!-- - **Follow every reference in an array of references**

  ```groq
  *[_type == 'book']{authors[]->{name, bio}}
  ``` -->

<!-- - **Explicity name the outer return field**

  ```groq
  {'threeMovieTitles': *[_type=='movie'][0..2].title}
  ```

- **Combining several unrelated queries in one request**
  ```groq
  {'featuredMovie': *[_type == 'movie' && title == 'Alien'][0], 'scifiMovies': *[_type == 'movie' && 'sci-fi' in genres]}
  ``` -->

## Special variables

Coming soon.

<!--

```groq
// *
*   // Everything, i.e. all documents

// @
*[ @["1"] ] // @ refers to the root value (document) of the scope
*[ @[$prop]._ref == $refId ] // Select reference prop from an outside variable.
*{"arraySizes": arrays[]{"size": count(@)}} // @ also works for nested scopes

// ^
// ^ refers to the enclosing document. Here ^._id refers to the id
// of the enclosing person record.
*[_type=="person"]{
  name,
  "relatedMovies": *[_type=='movie' && references(^._id)]{ title }
}

-->

## Conditionals

Coming soon.

<!--
// select() returns the first => pair whose left-hand side evaluates to true
*[_type=='movie']{..., "popularity": select(
  popularity > 20 => "high",
  popularity > 10 => "medium",
  popularity <= 10 => "low",
)}

// The first select() parameter without => is returned if no previous matches are found
*[_type=='movie']{..., "popularity": select(
  popularity > 20 => "high",
  popularity > 10 => "medium",
  "low",
)}

// Projections also have syntactic sugar for inline conditionals
*[_type=='movie']{
  ...,
  releaseDate >= '2018-06-01' => {
    "screenings": *[_type == 'screening' && movie._ref == ^._id],
    "news": *[_type == 'news' && movie._ref == ^._id],
  },
  popularity > 20 && rating > 7.0 => {
    "featured": true,
    "awards": *[_type == 'award' && movie._ref == ^._id],
  },
}

// The above is exactly equivalent to:
*[_type=='movie']{
  ...,
  ...select(releaseDate >= '2018-06-01' => {
    "screenings": *[_type == 'screening' && movie._ref == ^._id],
    "news": *[_type == 'news' && movie._ref == ^._id],
  }),
  ...select(popularity > 20 && rating > 7.0 => {
    "featured": true,
    "awards": *[_type == 'award' && movie._ref == ^._id],
  }),
}


// Specify sets of projections for different content types in an array
content[]{
  _type == 'type1' => {
    // Your selection of fields for type1
  },
  _type == 'type2' => {
    // Your selection of fields for type2
    "url": file.asset->url // Use joins to get data of referenced document
  }
}
```
-->

## Functions

Coming soon.

<!--
```groq
// any document that references the document
// with id person_sigourney-weaver,
// return only title
*[references("person_sigourney-weaver")]{title}

// Movies which reference ancient people
*[_type=="movie" && references(*[_type=="person" && age > 99]._id)]{title}

*[defined(tags)] // any document that has the attribute 'tags'

// coalesce takes a number of attribute references
// and returns the value of the first attribute
// that is non-null. In this example used to
// default back to the english language where a
// finnish translation does not exist.
*{"title": coalesce(title.fi, title.en)}

// count counts the number of items in a collection
count(*[_type == 'movie' && rating == 'R']) // returns number of R-rated movies

*[_type == 'movie']{
  title,
  "actorCount": count(actors) // Counts the number of elements in the array actors
}

// round() rounds number to the nearest integer, or the given number of decimals
round(3.14) // 3
round(3.14, 1) // 3.1
```
-->

## Arithmetic and Concatenation

Coming soon.

<!--


```groq
// Standard arithmetic operations are supported
1 + 2  // 3 (addition)
3 - 2  // 1 (subtraction)
2 * 3  // 6 (multiplication)
8 / 4  // 2 (division)
2 ** 4 // 16 (exponentiation)
8 % 3  // 2 (modulo)

// Exponentiation can be used to take square- and cube-roots too
9 ** (1/2)  // 3 (square root)
27 ** (1/3) // 3 (cube root)

// + can also concatenate strings, arrays, and objects:
"abc" + "def" // "abcdef"
[1,2] + [3,4] // [1,2,3,4]
{"a":1,"b":2} + {"c":3} // {"a":1,"b":2,"c":3}
``` -->
