{
  description = "A Nix-flake-based Shell development environment";

  inputs = {
    # Your preferred primary nix relesae
    nixpkgs.url = "github:NixOS/nixpkgs/release-24.11";
    # Nix wrapper around pre-commit hooks
    pre-commit-hooks.url = "github:cachix/pre-commit-hooks.nix";
    # Provides some nice helpers for multiple system compatibility
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      pre-commit-hooks,
      flake-utils,
    }:
    # Calls the provided function for each "default system", which
    # is the standard set.
    flake-utils.lib.eachDefaultSystem (
      system:
      # instantiate the package set for the supported system, with our
      # rust overlay
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      # "unpack" the pkgs attrset into the parent namespace
      with pkgs;
      {
        devShell = mkShell {
          inherit (self.checks.${system}.pre-commit-check) shellHook;
          # Packages required for development.
          packages =
            let
            in
            [
              just
              python312
              python312Packages.pyyaml
              python312Packages.rich
              python312Packages.jinja2
              tectonic
            ];
        };

        checks = {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            excludes = [ ];
            hooks = {
              check-json.enable = true;
              check-merge-conflicts.enable = true;
              check-toml.enable = true;
              check-yaml.enable = true;
              detect-private-keys.enable = true;
              end-of-file-fixer.enable = true;
              mixed-line-endings.enable = true;
              nixfmt-rfc-style.enable = true;
              trim-trailing-whitespace.enable = true;
              shellcheck.enable = true;
              ruff.enable = true;
              ruff-format.enable = true;
            };
          };
        };
      }
    );
}
