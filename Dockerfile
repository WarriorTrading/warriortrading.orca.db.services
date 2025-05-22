# ---- build stage -----------------------------------------------------------
FROM node:22.15-alpine AS builder

WORKDIR /workspace

ARG GITHUB_TOKEN_READ_WT_PACKAGES="GITHUB_TOKEN_READ_WT_PACKAGES"

COPY . .

RUN npm install
RUN npm run compile

############# Worker #############
# ---- runtime stage ---------------------------------------------------------
FROM node:22.15-alpine

WORKDIR /workspace

# tools you need in the running container
RUN apk add --no-cache \
      busybox-extras \
      postgresql-client \
      bash && \
    yarn global add knex@3.1

# copy application code after tools (keeps rebuilds fast)
COPY --from=builder /workspace/node_modules node_modules
COPY --from=builder /workspace/lib            lib
COPY --from=builder /workspace/config         config
COPY --from=builder /workspace/package.json   package.json
COPY --from=builder /workspace/knexfile.js    knexfile.js
COPY --from=builder /workspace/migrations     migrations
COPY --from=builder /workspace/public         public
COPY --from=builder /workspace/tsconfig.json  tsconfig.json

ENV PROFILE=deploy

CMD ["npm", "start"]

EXPOSE 4040