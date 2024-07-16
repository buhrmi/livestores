class UsersController < ApplicationController
  def show
    @user = User.where(id: 1).first_or_create!(name: "henlo")
  end
end
