FROM rust AS builder
COPY . .
RUN cargo build --release

FROM archlinux
COPY --from=builder ./target/release/backend ./target/release/backend
COPY --from=builder backend-static backend-static/
COPY --from=builder Rocket.toml Rocket.toml
ENV RUST_BACKTRACE 1
CMD ["/target/release/backend"]
