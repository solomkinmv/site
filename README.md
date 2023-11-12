# My personal site

## Development

Theme: https://themes.gohugo.io/themes/compost/

### Build locally

Preconditions:
```
brew install go hugo node
```

Serve locally:

```
hugo mod get -u
hugo mod npm pack
npm install
hugo server
```
