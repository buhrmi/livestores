class UsersController < ApplicationController
  def show
    @user_sgid = User.find(params[:id]).to_sgid_param
  end
end