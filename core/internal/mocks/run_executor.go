// Code generated by mockery v2.3.0. DO NOT EDIT.

package mocks

import (
	models "github.com/vordev/VOR/core/store/models"
	mock "github.com/stretchr/testify/mock"
)

// RunExecutor is an autogenerated mock type for the RunExecutor type
type RunExecutor struct {
	mock.Mock
}

// Execute provides a mock function with given fields: _a0
func (_m *RunExecutor) Execute(_a0 *models.ID) error {
	ret := _m.Called(_a0)

	var r0 error
	if rf, ok := ret.Get(0).(func(*models.ID) error); ok {
		r0 = rf(_a0)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}
